import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Filter,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Bookmark,
  GraduationCap,
  Flame,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { Book } from '../types';
import { booksApi } from '../api/client';
import { BookCard } from '../components/BookCard';
import { BookDetailModal } from '../components/BookDetailModal';
import { Hero3DBook } from '../components/Hero3DBook';
import { useCart } from '../context/CartContext';

interface HomePageProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onOpenAssessmentDocs: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchTerm,
  onSearchChange,
  onOpenAssessmentDocs,
}) => {
  const { addToCart } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Debounced search handling
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: any = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (inStockOnly) params.inStockOnly = true;
      if (sortBy === 'price-asc') params.sort = 'price-asc';
      else if (sortBy === 'price-desc') params.sort = 'price-desc';
      else if (sortBy === 'stock') params.sort = 'stock';
      else if (sortBy === 'title') params.sort = 'title';

      const res = await booksApi.getBooks(params);
      if (res.success) {
        setBooks(res.books);
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      }
    } catch (err: any) {
      console.error('Fetch books error:', err);
      setError(err.message || 'Failed to load book catalogue from database.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, sortBy, inStockOnly]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleClearFilters = () => {
    onSearchChange('');
    setSelectedCategory('All');
    setSortBy('featured');
    setInStockOnly(false);
  };

  const scrollToCatalogue = () => {
    const el = document.getElementById('catalogue-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find a prime featured book for the 3D stage
  const featuredBook = useMemo(() => {
    if (books.length === 0) return null;
    return (
      books.find((b) => b.title.includes('Pragmatic') || b.title.includes('Clean Code')) ||
      books.find((b) => b.stock > 0) ||
      books[0]
    );
  }, [books]);

  // Curated collections based on real categories
  const collections = [
    {
      id: 'col-tech',
      title: 'Computer Science & Engineering',
      desc: 'Architectural craftsmanship, design patterns, and system interview essentials.',
      category: 'Technology',
      icon: GraduationCap,
    },
    {
      id: 'col-lit',
      title: 'Great Literary Works',
      desc: 'Classic fiction that shapes modern perspective and timeless storytelling.',
      category: 'Fiction',
      icon: Bookmark,
    },
    {
      id: 'col-sci',
      title: 'Science & The Universe',
      desc: 'Explorations into human thought, astrophysics, and the cosmic continuum.',
      category: 'Science',
      icon: Flame,
    },
  ];

  // Curated student recommendations (deterministic rules from catalogue data)
  const studentRecommendations = useMemo(() => {
    return books
      .filter((b) => b.stock > 0)
      .slice(0, 4);
  }, [books]);

  return (
    <div className="min-h-screen text-[#2B211D] pb-24 relative">
      {/* Editorial 3D Hero Section with Warm Bookstore Photo Background */}
      <section className="relative overflow-hidden isolate border-b border-[#E6D8C5] pt-10 pb-14 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'unset' }}>
        {/* Background Layer: Warm Bookstore Interior Photo (inset: 0, z-index: -2) */}
        <picture className="absolute inset-0 w-full h-full -z-[2] pointer-events-none select-none">
          <source srcSet="/images/bookstore-hero.webp" type="image/webp" />
          <img
            src="/images/bookstore-hero.jpg"
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover object-[center_45%] motion-safe:[filter:blur(3px)] motion-safe:[transform:scale(1.05)]"
          />
        </picture>

        {/* Very light uniform tint overlay (inset: 0, z-index: -1) */}
        <div
          className="absolute inset-0 -z-[1] pointer-events-none bg-[rgba(255,248,230,0.22)] md:bg-[rgba(255,248,230,0.18)]"
          aria-hidden="true"
        />

        {/* Right-half vignette: darkens the right side of the photo for editorial depth */}
        <div
          className="absolute inset-0 -z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(270deg, rgba(30,15,10,0.18), transparent 60%)' }}
          aria-hidden="true"
        />

        {/* Soft 80px bottom fade blending into the next section's background color (#FFF8E8) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none -z-[1] bg-gradient-to-b from-transparent to-[#FFF8E8]"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions inside soft frosted readability panel */}
          <div className="lg:col-span-7 flex justify-center lg:justify-start">
            <div
              className="w-full bg-[rgba(255,248,230,0.86)] backdrop-blur-[4px] rounded-[24px] border border-white/50 shadow-lg text-center lg:text-left"
              style={{
                maxWidth: '600px',
                padding: 'clamp(20px,3vw,32px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px,1.6vw,20px)',
              }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1A6] text-[#6B352A] text-xs font-semibold border border-[#E6D8C5] shadow-xs self-center lg:self-start">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Classic Bookstore • Curated for Student Minds</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold font-editorial tracking-tight text-[#2B211D] leading-[1.1] m-0">
                Find your next <span className="text-[#6B352A] italic">chapter.</span>
              </h1>

              {/* Shortened paragraph – AA contrast: #4A3A33 on rgba(255,248,230,0.86) */}
              <p className="text-[17px] leading-snug m-0" style={{ color: '#4A3A33' }}>
                Academic textbooks and timeless literature, with live stock verification and atomic reservation.
              </p>

              {/* CTA Row: primary + secondary text button */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={scrollToCatalogue}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white text-sm font-bold shadow-md transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B352A]"
                  style={{ minHeight: '44px', padding: '0 1.25rem' }}
                  aria-label="Browse the book catalogue"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Browse Catalogue</span>
                </button>
                <button
                  onClick={onOpenAssessmentDocs}
                  className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-[#6B352A] hover:text-[#4D251F] underline-offset-2 hover:underline transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B352A] bg-transparent border-0"
                  style={{ minHeight: '44px', padding: '0 0.5rem' }}
                  aria-label="How it works – open assessment guide"
                >
                  How it works
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Category chips – each links to a real filtered catalogue view */}
              <div
                className="flex flex-wrap items-center justify-center lg:justify-start"
                role="group"
                aria-label="Browse by category"
                style={{ gap: '8px' }}
              >
                {[
                  { label: 'Technology', icon: GraduationCap },
                  { label: 'Fiction', icon: Bookmark },
                  { label: 'Science', icon: Flame },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setSelectedCategory(label);
                      scrollToCatalogue();
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border text-xs font-semibold transition cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B352A] ${
                      selectedCategory === label
                        ? 'bg-[#6B352A] text-white border-[#6B352A]'
                        : 'bg-white/70 text-[#4A3A33] border-[#E6D8C5] hover:bg-[#FFF1A6] hover:border-[#6B352A]/40'
                    }`}
                    style={{ minHeight: '44px', padding: '0 0.875rem' }}
                    aria-pressed={selectedCategory === label}
                    aria-label={`Filter catalogue by ${label}`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Book Stage */}
          <div className="lg:col-span-5 flex justify-center drop-shadow-md">
            <Hero3DBook
              featuredBook={featuredBook}
              onQuickView={(b) => setSelectedBook(b)}
              onAddToCart={(id) => addToCart(id, 1)}
            />
          </div>
        </div>
      </section>

      {/* Curated Collections Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {collections.map((col) => {
            const Icon = col.icon;
            const isSelected = selectedCategory === col.category;
            return (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedCategory(col.category);
                  scrollToCatalogue();
                }}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#6B352A] ring-1 ring-[#6B352A] shadow-md'
                    : 'bg-[#FFFFFF] hover:bg-[#FFF8E8] border-[#E6D8C5] hover:border-[#6B352A]/40'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#FFF1A6] text-[#6B352A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-base font-bold text-[#2B211D] mb-1">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#75665D] leading-relaxed">
                    {col.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E6D8C5] flex items-center justify-between text-xs font-semibold text-[#6B352A]">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Catalogue Section with Warm White Backdrop */}
      <main id="catalogue-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6D8C5] shadow-sm">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B352A] block mb-1">
                Course Catalogue &amp; Library
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#2B211D]">
                All Available Books
              </h2>
            </div>
            <p className="text-xs text-[#75665D] max-w-sm">
              Real-time inventory levels. Add titles to cart or save them to your personal reading wishlist.
            </p>
          </div>

          {/* Filter and Control Bar */}
          <div className="bg-[#FFF8E8] rounded-2xl p-4 sm:p-5 border border-[#E6D8C5] shadow-2xs mb-8 space-y-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-[#75665D] flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#6B352A]" />
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#6B352A] text-white font-bold shadow-xs'
                      : 'bg-[#FFFFFF] text-[#75665D] hover:bg-[#FFF1A6]/50 hover:text-[#2B211D] border border-[#E6D8C5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Secondary Controls: Sorting, In-Stock Toggle, and Book Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6D8C5] text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-[#2B211D] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6B352A] focus:ring-[#6B352A] bg-white border-[#E6D8C5]"
                  />
                  <span>In Stock Only</span>
                </label>

                <div className="flex items-center gap-1.5 text-[#75665D]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B352A]" />
                  <span className="font-medium text-[#2B211D]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FFFFFF] border border-[#E6D8C5] rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
                    aria-label="Sort books catalogue"
                  >
                    <option value="featured">Featured / Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock">Stock: High to Low</option>
                    <option value="title">Title: A to Z</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#75665D] font-medium">
                  Showing <strong className="text-[#2B211D]">{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
                </span>
                {(searchTerm || selectedCategory !== 'All' || inStockOnly || sortBy !== 'featured') && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[#6B352A] hover:text-[#4D251F] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-3 border-[#6B352A] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[#75665D] text-xs font-medium">Loading books from database catalogue...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-6 rounded-2xl bg-[#A52D2D]/10 border border-[#A52D2D]/30 text-[#A52D2D] max-w-xl mx-auto text-center my-12">
              <AlertCircle className="w-8 h-8 text-[#A52D2D] mx-auto mb-2" />
              <h3 className="font-bold text-base mb-1">Failed to Load Catalogue</h3>
              <p className="text-xs text-[#75665D] mb-4">{error}</p>
              <button
                onClick={fetchBooks}
                className="px-4 py-2 rounded-xl bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && books.length === 0 && (
            <div className="py-20 text-center max-w-md mx-auto bg-[#FFFFFF] rounded-2xl border border-[#E6D8C5] p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FFF8E8] text-[#75665D] flex items-center justify-center mx-auto mb-4 border border-[#E6D8C5]">
                <BookOpen className="w-8 h-8 opacity-40 text-[#6B352A]" />
              </div>
              <h3 className="text-lg font-bold font-editorial text-[#2B211D] mb-1">
                No matching books found
              </h3>
              <p className="text-xs text-[#75665D] mb-6">
                {searchTerm
                  ? `No books match your keyword "${searchTerm}". Try checking for spelling or clear search filters.`
                  : 'No books match the selected category filter.'}
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Book Catalogue Grid */}
          {!isLoading && !error && books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} onSelect={(b) => setSelectedBook(b)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Curated Recommendations Shelf */}
      {studentRecommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6D8C5] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF1A6] text-[#6B352A] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[#2B211D]">
                    Curated for Student Reading Lists
                  </h3>
                  <p className="text-xs text-[#75665D]">
                    Top-rated coursework essentials and influential literature recommended by academic faculty.
                  </p>
                </div>
              </div>
              <button
                onClick={scrollToCatalogue}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#6B352A] hover:text-[#4D251F] hover:underline"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {studentRecommendations.map((book) => (
                <BookCard key={`rec-${book._id}`} book={book} onSelect={(b) => setSelectedBook(b)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Book Detail Modal */}
      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};
