import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './server/db';
import { seedDatabase } from './server/seed';
import authRoutes from './server/routes/auth';
import booksRoutes from './server/routes/books';
import cartRoutes from './server/routes/cart';
import ordersRoutes from './server/routes/orders';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Online Bookstore API',
    timestamp: new Date().toISOString(),
  });
});

// Global API error handler
app.use('/api', (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

async function startServer() {
  try {
    // 1. Connect to MongoDB (External MONGODB_URI or embedded MongoMemoryServer)
    await connectDB();

    // 2. Seed initial catalogue and demo customer
    await seedDatabase();

    // 3. Vite development middleware or static production serve
    const isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('[Server] Vite middleware mounted for development.');
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log(`[Server] Serving production static files from ${distPath}`);
    }

    // 4. Start listening on PORT 3000
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Online Bookstore server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Server Start Fatal Error]:', error);
    process.exit(1);
  }
}

startServer();
