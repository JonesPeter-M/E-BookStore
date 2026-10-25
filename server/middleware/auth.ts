import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? '' : 'peter-bookstore-dev-jwt-secret-2026');

if (isProduction && !process.env.JWT_SECRET) {
  console.warn('[SECURITY WARNING] JWT_SECRET is not configured in production environment variables!');
}

export interface AuthUserPayload {
  userId: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Please provide a valid Authorization Bearer token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = JWT_SECRET || 'peter-bookstore-dev-jwt-secret-2026';
    const decoded = jwt.verify(token, secret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is invalid or has expired. Please log in again.',
    });
  }
}

export function generateToken(payload: AuthUserPayload): string {
  const secret = JWT_SECRET || 'peter-bookstore-dev-jwt-secret-2026';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
