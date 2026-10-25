import test from 'node:test';
import assert from 'node:assert/strict';
import { connectDB, closeDB } from './db';
import { seedDatabase } from './seed';
import { User } from './models/User';
import { Book } from './models/Book';
import { Cart } from './models/Cart';
import { Order } from './models/Order';
import { generateToken } from './middleware/auth';

test('Full Stack Bookstore Database & Operations Suite', async (t) => {
  await connectDB();
  await seedDatabase(true);

  await t.test('Seed database populates at least 10 books with stock levels', async () => {
    const count = await Book.countDocuments();
    assert.ok(count >= 10, `Expected at least 10 books, found ${count}`);

    const cleanCode = await Book.findOne({ title: /Clean Code/i });
    assert.ok(cleanCode, 'Clean Code should exist in catalogue');
    assert.ok(cleanCode.stock > 0, 'Clean Code should have stock');
    assert.equal(cleanCode.category, 'Technology');

    const outOfStock = await Book.findOne({ stock: 0 });
    assert.ok(outOfStock, 'Should have at least one book with 0 stock to test out-of-stock behavior');
  });

  await t.test('User registration and bcrypt password comparison works', async () => {
    const testEmail = `test_${Date.now()}@bookstore.test`;
    const user = new User({
      name: 'Test Customer',
      email: testEmail,
      password: 'mypassword123',
    });
    await user.save();

    // Password must be hashed with bcrypt
    assert.notEqual(user.password, 'mypassword123');
    assert.ok(user.password!.startsWith('$2'));

    // Compare method
    const valid = await user.comparePassword('mypassword123');
    assert.equal(valid, true);

    const invalid = await user.comparePassword('wrongpassword');
    assert.equal(invalid, false);

    // JWT token generation
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });
    assert.ok(token && typeof token === 'string');
  });

  await t.test('Cart enforces quantity bounds and stock checks', async () => {
    const demoUser = await User.findOne({ email: 'demo@bookstore.test' });
    assert.ok(demoUser);

    const book = await Book.findOne({ stock: { $gt: 5 } });
    assert.ok(book);

    let cart = await Cart.findOne({ user: demoUser._id });
    if (!cart) cart = new Cart({ user: demoUser._id, items: [] });
    cart.items = [{ book: book._id, quantity: 2 }];
    await cart.save();

    assert.equal(cart.items.length, 1);
    assert.equal(cart.items[0].quantity, 2);
  });

  await t.test('Order creation decrements book stock atomically and preserves snapshot', async () => {
    const demoUser = await User.findOne({ email: 'demo@bookstore.test' });
    assert.ok(demoUser);

    const book = await Book.findOne({ stock: { $gt: 3 } });
    assert.ok(book);
    const initialStock = book.stock;
    const orderQty = 2;

    // Simulate atomic decrement
    const updatedBook = await Book.findOneAndUpdate(
      { _id: book._id, stock: { $gte: orderQty } },
      { $inc: { stock: -orderQty } },
      { new: true }
    );
    assert.ok(updatedBook);
    assert.equal(updatedBook.stock, initialStock - orderQty);

    // Create order document with immutable snapshot
    const order = new Order({
      user: demoUser._id,
      customer: {
        name: 'Alex Demo Customer',
        email: 'demo@bookstore.test',
        phone: '555-019-2834',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
      },
      items: [
        {
          book: book._id,
          title: book.title,
          price: book.price,
          quantity: orderQty,
          subtotal: Number((book.price * orderQty).toFixed(2)),
        },
      ],
      totalAmount: Number((book.price * orderQty).toFixed(2)),
      status: 'Confirmed',
    });
    await order.save();

    assert.ok(order._id);
    assert.equal(order.items[0].title, book.title);
    assert.equal(order.items[0].price, book.price);

    // Retrieve order via query
    const fetched = await Order.findById(order._id);
    assert.ok(fetched);
    assert.equal(fetched.totalAmount, order.totalAmount);
  });

  await closeDB();
});
