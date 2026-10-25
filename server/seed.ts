import { Book } from './models/Book';
import { User } from './models/User';

export const sampleBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Technology',
    price: 38.99,
    stock: 14,
    isbn: '978-0132350884',
    rating: 4.8,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost due to poorly written code. This classic software craftsmanship guide teaches you how to write code that is clean, readable, and resilient.',
  },
  {
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    category: 'Technology',
    price: 42.50,
    stock: 9,
    isbn: '978-0135957059',
    rating: 4.9,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process: taking a requirement and producing working, maintainable code that delights users.',
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    category: 'Technology',
    price: 49.95,
    stock: 5,
    isbn: '978-0201633610',
    rating: 4.7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
  },
  {
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    author: 'James Clear',
    category: 'Self-Help',
    price: 21.00,
    stock: 18,
    isbn: '978-0735211292',
    rating: 4.9,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    price: 24.99,
    stock: 12,
    isbn: '978-0062316097',
    rating: 4.8,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    description: 'One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one: Homo sapiens. How did our species succeed in the battle for dominance? An international phenomenon.',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    price: 15.99,
    stock: 20,
    isbn: '978-0060935467',
    rating: 4.9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Compassionate, dramatic, and deeply moving, Harper Lee examines racism and prejudice in the deep South through the eyes of young Scout Finch.',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    price: 13.50,
    stock: 2, // Low stock indicator test
    isbn: '978-0743273565',
    rating: 4.5,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    description: 'The exemplary novel of the Jazz Age, F. Scott Fitzgerald’s third book stands as the supreme achievement of his career. The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan.',
  },
  {
    title: 'System Design Interview: An Insider’s Guide',
    author: 'Alex Xu',
    category: 'Technology',
    price: 36.00,
    stock: 7,
    isbn: '979-8664653403',
    rating: 4.8,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    description: 'An invaluable guide for software engineers preparing for system design interviews. Provides a step-by-step framework for tackling complex distributed systems questions with real-world architectural diagrams.',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Science',
    price: 22.50,
    stock: 11,
    isbn: '978-0374533557',
    rating: 4.6,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80',
    description: 'The monumental international bestseller by Nobel Memorial Prize in Economic Sciences laureate Daniel Kahneman. Explore the two systems that drive the way we think: System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.',
  },
  {
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    category: 'Science',
    price: 18.00,
    stock: 0, // OUT OF STOCK test
    isbn: '978-0393609394',
    rating: 4.7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    description: 'What is the nature of space and time? How do we fit within the universe? Neil deGrasse Tyson brings the cosmic universe down to Earth succinctly and clearly, with sparkling wit, in digestible chapters consumable anytime and anywhere.',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Business',
    price: 19.99,
    stock: 15,
    isbn: '978-0857197689',
    rating: 4.8,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
    description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people. 19 short stories exploring the strange ways people think about money.',
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    price: 14.20,
    stock: 8,
    isbn: '978-0812968255',
    rating: 4.8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    description: 'Nearly two thousand years after it was written, this personal diary of the Roman Emperor Marcus Aurelius remains one of the greatest guides to spiritual resilience, duty, and ethics ever composed.',
  },
];

export async function seedDatabase(force = false): Promise<void> {
  const count = await Book.countDocuments();
  if (count === 0 || force) {
    if (force) {
      await Book.deleteMany({});
      console.log('[Seed] Cleared existing books for re-seed.');
    }
    console.log('[Seed] Seeding sample book catalogue (12 books)...');
    await Book.insertMany(sampleBooks);
    console.log('[Seed] Book catalogue seeded successfully.');
  } else {
    console.log(`[Seed] Book catalogue already contains ${count} books. Skipping book re-seed.`);
  }

  // Ensure demo customer exists
  const demoEmail = 'demo@bookstore.test';
  const existingUser = await User.findOne({ email: demoEmail });
  if (!existingUser) {
    console.log('[Seed] Creating demo customer account (demo@bookstore.test)...');
    const demoUser = new User({
      name: 'Alex Demo Customer',
      email: demoEmail,
      password: 'password123',
      phone: '+1 555-019-2834',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
    });
    await demoUser.save();
    console.log('[Seed] Demo customer created successfully.');
  }
}
