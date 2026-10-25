import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address, city, postalCode } = req.body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: 'Name is required and must be at least 2 characters long.',
      });
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    // Check if user already exists
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      city: city?.trim() || '',
      postalCode: postalCode?.trim() || '',
    });

    await newUser.save();

    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        postalCode: newUser.postalCode,
      },
    });
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to a server error.',
      error: err.message,
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      },
    });
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed due to a server error.',
      error: err.message,
    });
  }
});

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
  }
});

export default router;
