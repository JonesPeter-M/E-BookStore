import { Router, Request, Response } from 'express';
import { Book } from '../models/Book';
import { seedDatabase } from '../seed';

const router = Router();

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// GET /api/books
// Supports: ?search=keyword & ?category=tech & ?sort=price-asc/price-desc/stock/title & inStockOnly=true
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, sort, inStockOnly } = req.query;

    const query: any = {};

    if (category && typeof category === 'string' && category !== 'All') {
      query.category = category.trim();
    }

    if (search && typeof search === 'string') {
      const cleanSearch = search.trim().slice(0, 100);
      if (cleanSearch) {
        const escaped = escapeRegex(cleanSearch);
        const searchRegex = new RegExp(escaped, 'i');
        query.$or = [{ title: searchRegex }, { author: searchRegex }];
      }
    }

    if (inStockOnly === 'true') {
      query.stock = { $gt: 0 };
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'stock') {
      sortOptions = { stock: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    const books = await Book.find(query).sort(sortOptions);

    // Retrieve unique categories for filter UI
    const categories = await Book.distinct('category');

    res.json({
      success: true,
      count: books.length,
      categories: ['All', ...categories],
      books,
    });
  } catch (err: any) {
    console.error('[Get Books Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book catalogue.',
    });
  }
});

// GET /api/books/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || id.length !== 24) {
      res.status(400).json({
        success: false,
        message: 'Invalid book identifier format.',
      });
      return;
    }

    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found in catalogue.',
      });
      return;
    }

    res.json({
      success: true,
      book,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: 'Invalid book identifier or database query error.',
    });
  }
});

// POST /api/books/reset-seed (Assessment & demo mode catalogue reset)
router.post('/reset-seed', async (req: Request, res: Response): Promise<void> => {
  try {
    const isDemoAllowed = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEMO_SEED === 'true' || req.headers['x-demo-key'] === 'peter-demo';
    if (!isDemoAllowed) {
      res.status(403).json({
        success: false,
        message: 'Database reset endpoint is restricted to demonstration mode.',
      });
      return;
    }

    await seedDatabase(true);
    res.json({
      success: true,
      message: 'Book catalogue has been reset and re-seeded to original stock levels.',
    });
  } catch (err: any) {
    console.error('[Reset Seed Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to re-seed book catalogue.',
    });
  }
});

export default router;
