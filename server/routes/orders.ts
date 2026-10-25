import { Router, Request, Response } from 'express';
import { Order, IOrderItem } from '../models/Order';
import { Cart } from '../models/Cart';
import { Book, IBook } from '../models/Book';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply JWT authentication
router.use(authMiddleware);

// POST /api/orders (Checkout & Order Creation)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const decrementedItems: { bookId: string; quantity: number }[] = [];
  try {
    const userId = req.user!.userId;
    const { customer } = req.body;

    // 1. Server-side validation of customer details
    if (!customer || typeof customer !== 'object') {
      res.status(400).json({
        success: false,
        message: 'Customer checkout details are required.',
      });
      return;
    }

    const { name, email, phone, address, city, postalCode } = customer;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (minimum 2 characters).',
      });
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address for order notifications.',
      });
      return;
    }

    const phoneClean = (phone || '').replace(/[\s\-\(\)\+]/g, '');
    if (!phone || typeof phone !== 'string' || phoneClean.length < 7) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (minimum 7 digits).',
      });
      return;
    }

    if (!address || typeof address !== 'string' || address.trim().length < 4) {
      res.status(400).json({
        success: false,
        message: 'Please provide a complete delivery street address.',
      });
      return;
    }

    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid city name.',
      });
      return;
    }

    if (!postalCode || typeof postalCode !== 'string' || postalCode.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid postal/ZIP code.',
      });
      return;
    }

    // 2. Retrieve customer's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add books to your cart before placing an order.',
      });
      return;
    }

    // 3. Pre-validate all items exist and have adequate stock before deduction
    const bookIds = cart.items.map((i: any) => i.book);
    const books = await Book.find({ _id: { $in: bookIds } });
    const bookMap = new Map<string, IBook>();
    books.forEach((b) => bookMap.set(b._id.toString(), b));

    for (const item of cart.items) {
      const book = bookMap.get(item.book.toString());
      if (!book) {
        res.status(400).json({
          success: false,
          message: 'One or more books in your cart are no longer available in the catalogue.',
        });
        return;
      }

      if (item.quantity <= 0) {
        res.status(400).json({
          success: false,
          message: `Invalid quantity for "${book.title}".`,
        });
        return;
      }

      if (book.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Requested: ${item.quantity}, Available: ${book.stock}. Please adjust your cart.`,
        });
        return;
      }
    }

    // 4. Atomic stock decrement with rollback guarantee
    let stockFailure: string | null = null;

    for (const item of cart.items) {
      const bookIdStr = item.book.toString();
      const updatedBook = await Book.findOneAndUpdate(
        { _id: item.book, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { returnDocument: 'after' }
      );

      if (!updatedBook) {
        const failedBook = bookMap.get(bookIdStr);
        stockFailure = failedBook ? failedBook.title : 'Selected book';
        break;
      }

      decrementedItems.push({ bookId: bookIdStr, quantity: item.quantity });
    }

    // If any item failed to atomically decrement due to race condition or stock depletion:
    if (stockFailure) {
      // Rollback all previously decremented items
      for (const rolled of decrementedItems) {
        await Book.findByIdAndUpdate(rolled.bookId, { $inc: { stock: rolled.quantity } });
      }

      res.status(400).json({
        success: false,
        message: `Insufficient stock for "${stockFailure}". Another customer may have just ordered the last copies. Please adjust your cart.`,
      });
      return;
    }

    // 5. Construct order items with snapshot data (authoritative database prices, NEVER client input)
    let itemsSubtotal = 0;
    let totalItemsQty = 0;
    const orderItems: IOrderItem[] = [];

    for (const item of cart.items) {
      const book = bookMap.get(item.book.toString())!;
      const unitPrice = book.price;
      const subtotal = Number((unitPrice * item.quantity).toFixed(2));
      itemsSubtotal += subtotal;
      totalItemsQty += item.quantity;

      orderItems.push({
        book: book._id,
        title: book.title,
        price: unitPrice,
        quantity: item.quantity,
        subtotal: subtotal,
      });
    }

    itemsSubtotal = Number(itemsSubtotal.toFixed(2));
    const shipping = totalItemsQty > 0 ? (itemsSubtotal >= 35 ? 0 : 4.99) : 0;
    const estimatedTax = Number((itemsSubtotal * 0.08).toFixed(2));
    const totalAmount = Number((itemsSubtotal + shipping + estimatedTax).toFixed(2));

    // 6. Create the order
    const order = new Order({
      user: userId,
      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
      },
      items: orderItems,
      totalAmount,
      status: 'Confirmed',
    });

    try {
      await order.save();
    } catch (orderSaveErr) {
      console.error('[Order Save Failure, triggering stock rollback]:', orderSaveErr);
      for (const rolled of decrementedItems) {
        await Book.findByIdAndUpdate(rolled.bookId, { $inc: { stock: rolled.quantity } });
      }
      res.status(500).json({
        success: false,
        message: 'Could not record order details. Inventory holds have been reversed.',
      });
      return;
    }

    // 7. Clear the customer's cart only after successful order creation
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Stock has been reserved.',
      order: {
        _id: order._id,
        orderId: order._id,
        createdAt: order.createdAt,
        customer: order.customer,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  } catch (err: any) {
    console.error('[Create Order Error]:', err);
    // Compensate any decremented items if error thrown unexpectedly
    if (decrementedItems.length > 0) {
      for (const rolled of decrementedItems) {
        try {
          await Book.findByIdAndUpdate(rolled.bookId, { $inc: { stock: rolled.quantity } });
        } catch {}
      }
    }
    res.status(500).json({
      success: false,
      message: 'Failed to process order. Please try again.',
    });
  }
});

// GET /api/orders/me (Order History)
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: any) {
    console.error('[Get Orders Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order history.',
    });
  }
});

export default router;
