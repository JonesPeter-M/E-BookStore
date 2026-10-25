import { Router, Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Book, IBook } from '../models/Book';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Apply JWT authentication to all cart routes
router.use(authMiddleware);

// Helper to format and calculate cart totals with populated books
async function getPopulatedCart(userId: string) {
  let cart = await Cart.findOne({ user: userId }).populate<{ items: { book: IBook; quantity: number }[] }>('items.book');

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }

  // Filter out any items where book might have been removed
  const validItems = cart.items.filter((item: any) => item.book && (item.book as IBook)._id);

  let subtotal = 0;
  let totalQuantity = 0;

  const items = validItems.map((item: any) => {
    const book = item.book as IBook;
    const itemSubtotal = Number((book.price * item.quantity).toFixed(2));
    subtotal += itemSubtotal;
    totalQuantity += item.quantity;

    return {
      _id: (item as any)._id,
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        category: book.category,
        stock: book.stock,
        coverImage: book.coverImage,
      },
      quantity: item.quantity,
      subtotal: itemSubtotal,
      exceedsStock: item.quantity > book.stock,
    };
  });

  return {
    cartId: cart._id,
    userId: cart.user,
    items,
    totalQuantity,
    subtotal: Number(subtotal.toFixed(2)),
  };
}

// GET /api/cart
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const formattedCart = await getPopulatedCart(userId);

    res.json({
      success: true,
      cart: formattedCart,
    });
  } catch (err: any) {
    console.error('[Get Cart Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shopping cart.',
      error: err.message,
    });
  }
});

// POST /api/cart
// Body: { bookId: string, quantity?: number } (default quantity: 1)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { bookId, quantity = 1 } = req.body;

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be a positive whole number greater than 0.',
      });
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found in catalogue.',
      });
      return;
    }

    if (book.stock <= 0) {
      res.status(400).json({
        success: false,
        message: `"${book.title}" is currently out of stock.`,
      });
      return;
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item: any) => item.book.toString() === bookId);

    const currentQtyInCart = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
    const targetQty = currentQtyInCart + parsedQty;

    if (targetQty > book.stock) {
      res.status(400).json({
        success: false,
        message: `Cannot add ${parsedQty} more. Only ${book.stock} available in stock (you already have ${currentQtyInCart} in your cart).`,
      });
      return;
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = targetQty;
    } else {
      cart.items.push({
        book: book._id,
        quantity: parsedQty,
      });
    }

    await cart.save();

    const formattedCart = await getPopulatedCart(userId);
    res.status(200).json({
      success: true,
      message: `Added "${book.title}" to your cart.`,
      cart: formattedCart,
    });
  } catch (err: any) {
    console.error('[Add to Cart Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart.',
      error: err.message,
    });
  }
});

// PUT /api/cart/:bookId
// Body: { quantity: number }
router.put('/:bookId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { bookId } = req.params;
    const { quantity } = req.body;

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer of at least 1.',
      });
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
      return;
    }

    if (parsedQty > book.stock) {
      res.status(400).json({
        success: false,
        message: `Cannot set quantity to ${parsedQty}. Only ${book.stock} item(s) currently available in stock.`,
      });
      return;
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found.',
      });
      return;
    }

    const itemIndex = cart.items.findIndex((item: any) => item.book.toString() === bookId);
    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'This book is not currently in your cart.',
      });
      return;
    }

    cart.items[itemIndex].quantity = parsedQty;
    await cart.save();

    const formattedCart = await getPopulatedCart(userId);
    res.json({
      success: true,
      message: 'Cart item quantity updated successfully.',
      cart: formattedCart,
    });
  } catch (err: any) {
    console.error('[Update Cart Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item quantity.',
      error: err.message,
    });
  }
});

// DELETE /api/cart/:bookId
router.delete('/:bookId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({
        success: false,
        message: 'Cart not found.',
      });
      return;
    }

    cart.items = cart.items.filter((item: any) => item.book.toString() !== bookId);
    await cart.save();

    const formattedCart = await getPopulatedCart(userId);
    res.json({
      success: true,
      message: 'Item removed from cart.',
      cart: formattedCart,
    });
  } catch (err: any) {
    console.error('[Remove Cart Item Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart.',
      error: err.message,
    });
  }
});

// DELETE /api/cart (Clear all items)
router.delete('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart has been cleared.',
      cart: {
        cartId: cart?._id,
        userId,
        items: [],
        totalQuantity: 0,
        subtotal: 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart.',
    });
  }
});

export default router;
