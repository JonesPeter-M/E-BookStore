import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Square,
  Clock,
  Database,
  Shield,
  Server,
  Layers,
  RotateCcw,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { booksApi } from '../api/client';
import { useCart } from '../context/CartContext';

interface AssessmentDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshCatalogue: () => void;
}

export const AssessmentDocsModal: React.FC<AssessmentDocsModalProps> = ({
  isOpen,
  onClose,
  onRefreshCatalogue,
}) => {
  const { refreshCart } = useCart();
  const [activeTab, setActiveTab] = useState<'demo' | 'api' | 'checklist' | 'architecture' | 'setup'>('demo');
  const [resettingStock, setResettingStock] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Interactive checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
    'c3': true,
    'c4': true,
    'c5': true,
    'c6': true,
    'c7': true,
    'c8': true,
  });

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetStock = async () => {
    try {
      setResettingStock(true);
      const res = await booksApi.resetSeed();
      setResetMessage(res.message);
      onRefreshCatalogue();
      await refreshCart();
      setTimeout(() => setResetMessage(null), 4000);
    } catch (err: any) {
      setResetMessage('Error resetting catalogue: ' + err.message);
    } finally {
      setResettingStock(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[1100] overflow-y-auto bg-[#2B211D]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-modal-title"
    >
      <div className="relative bg-[#FFFFFF] text-[#2B211D] rounded-2xl max-w-4xl w-full shadow-2xl border border-[#E6D8C5] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#FFF8E8] flex items-center justify-between border-b border-[#E6D8C5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B352A] text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="docs-modal-title" className="text-lg sm:text-xl font-bold font-editorial text-[#2B211D] flex items-center gap-2">
                PETER Online Book Store — Evaluation &amp; Assessment Suite
              </h2>
              <p className="text-xs text-[#75665D]">
                Full Stack MERN Architecture • Atomic Concurrency • Last finish made by Jones JP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#FFF8E8] text-[#75665D] hover:text-[#2B211D] flex items-center justify-center transition cursor-pointer border border-[#E6D8C5]"
            aria-label="Close documentation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#FFF8E8] border-b border-[#E6D8C5] px-4 gap-1 overflow-x-auto">
          {[
            { id: 'demo', label: '10-Min Demo Script', icon: Clock },
            { id: 'checklist', label: 'Testing Checklist', icon: CheckSquare },
            { id: 'api', label: 'API Specification (10 Endpoints)', icon: Server },
            { id: 'architecture', label: 'Architecture & Concurrency', icon: Database },
            { id: 'setup', label: 'Setup & Execution', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'border-[#6B352A] text-[#6B352A] bg-[#FFFFFF] -mb-px rounded-t-lg shadow-2xs'
                    : 'border-transparent text-[#75665D] hover:text-[#2B211D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 text-[#2B211D] text-xs sm:text-sm space-y-4 leading-relaxed">
          {/* TAB 1: 10-Minute Assessment Demonstration Script */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#FFF8E8] p-4 rounded-xl border border-[#E6D8C5]">
                <div>
                  <h3 className="font-bold font-editorial text-[#6B352A] text-base">
                    10-Minute Assessment Presentation &amp; Live Walkthrough Script
                  </h3>
                  <p className="text-xs text-[#75665D] mt-0.5">
                    Structured timing guide for presenting this full-stack application to evaluators.
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      document.getElementById('demo-script-text')?.innerText || '',
                      'demo'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  {copiedSection === 'demo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'demo' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>

              <div id="demo-script-text" className="space-y-4 bg-[#FFFFFF] p-4 rounded-xl border border-[#E6D8C5]">
                <div className="p-3 bg-[#FFF8E8] rounded-lg border-l-4 border-[#6B352A] shadow-2xs">
                  <span className="font-bold text-[#6B352A] block text-xs uppercase tracking-wider mb-1">
                    Minute 0:00 - 1:30 | Introduction &amp; Stack Overview
                  </span>
                  <p className="text-[#2B211D]">
                    <strong>Speaker:</strong> "Hello! Today I am presenting <em>PETER Online Book Store</em>, a complete full-stack web application designed for students and readers with high reliability, strict stock management, and responsive e-commerce experience.
                    The frontend is built with React 19, Vite, Tailwind CSS, Lucide Icons, and Axios. The backend runs on Node.js and Express.js, connecting to MongoDB using Mongoose with full schema constraints and JWT authentication with bcrypt password hashing."
                  </p>
                </div>

                <div className="p-3 bg-[#FFF8E8] rounded-lg border-l-4 border-[#6B352A] shadow-2xs">
                  <span className="font-bold text-[#6B352A] block text-xs uppercase tracking-wider mb-1">
                    Minute 1:30 - 3:30 | Feature 1: Catalogue, Live Search &amp; Category Filtering
                  </span>
                  <p className="text-[#2B211D]">
                    <strong>Speaker:</strong> "Let's begin with the Book Catalogue. Our MongoDB database is pre-seeded with 12 distinct books across categories like Technology, Science, Fiction, and Philosophy.
                    Notice that each book displays its title, author, formatted price, category, and real-time available stock badge.
                    For example, <em>The Great Gatsby</em> shows <strong>'Only 2 left!'</strong>, while <em>Astrophysics for People in a Hurry</em> shows a clear <strong>'Out of Stock'</strong> state with a disabled cart button.
                    If I type 'Clean' in the search bar, it immediately performs keyword search on both title and author. Filtering by categories instantly filters the collection."
                  </p>
                </div>

                <div className="p-3 bg-[#FFF8E8] rounded-lg border-l-4 border-[#6B352A] shadow-2xs">
                  <span className="font-bold text-[#6B352A] block text-xs uppercase tracking-wider mb-1">
                    Minute 3:30 - 5:30 | Feature 2: Customer Authentication &amp; Reading Wishlist
                  </span>
                  <p className="text-[#2B211D]">
                    <strong>Speaker:</strong> "Next is customer isolation and wishlist management. Carts and orders are strictly user-scoped using JWT bearer tokens.
                    I can click 'Demo Login' or register a new customer account. Passwords are securely hashed with bcrypt salt rounds.
                    We have added a reading wishlist toggle with live counts, allowing students to plan reading lists.
                    Now let's add <em>Clean Code</em> to our cart. The slide-over cart drawer appears.
                    Notice our stock boundary validation: if a student tries to increment beyond the warehouse stock, our frontend and backend both reject the excessive quantity.
                    All cart items are persisted in MongoDB so students never lose their cart across page reloads."
                  </p>
                </div>

                <div className="p-3 bg-[#FFF8E8] rounded-lg border-l-4 border-[#286647] shadow-2xs">
                  <span className="font-bold text-[#286647] block text-xs uppercase tracking-wider mb-1">
                    Minute 5:30 - 8:00 | Feature 3: Atomic Checkout &amp; Overselling Prevention
                  </span>
                  <p className="text-[#2B211D]">
                    <strong>Speaker:</strong> "Now let's proceed to checkout. The checkout page validates customer name, email format, phone digits, and delivery address on both client and server.
                    Crucially: the server calculates the order total using database prices, never client-provided prices, preventing tampering.
                    To prevent overselling, our order endpoint utilizes atomic MongoDB operations:
                    <code>findOneAndUpdate(&#123; _id: bookId, stock: &#123; $gte: requestedQty &#125; &#125;, &#123; $inc: &#123; stock: -requestedQty &#125; &#125;)</code>.
                    If stock is depleted or order save encounters an error, all changes are rolled back. Only upon 100% success is the order created and the cart cleared."
                  </p>
                </div>

                <div className="p-3 bg-[#FFF8E8] rounded-lg border-l-4 border-[#6B352A] shadow-2xs">
                  <span className="font-bold text-[#6B352A] block text-xs uppercase tracking-wider mb-1">
                    Minute 8:00 - 10:00 | Feature 4 &amp; 5: Order Confirmation &amp; Historical Snapshot
                  </span>
                  <p className="text-[#2B211D]">
                    <strong>Speaker:</strong> "Upon placing the order, we arrive at the Order Confirmation page showing our newly assigned Order ID and delivery summary.
                    Navigating to 'My Orders' shows the order history. Notice that each order stores an immutable snapshot of the book's title and price at the exact moment of purchase.
                    Even if future book prices or titles change, past orders maintain 100% financial accuracy.
                    Finally, we have included a 'Reset Stock' button right here in the toolbar so you can re-run and re-test this flow as many times as you like. Thank you!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Testing Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold font-editorial text-[#2B211D] text-base">
                    Verification &amp; Assessment Testing Checklist
                  </h3>
                  <p className="text-xs text-[#75665D]">
                    Click each item to check off requirements during evaluation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetStock}
                    disabled={resettingStock}
                    className="px-3 py-1.5 rounded-lg border border-[#6B352A] text-[#6B352A] hover:bg-[#6B352A]/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${resettingStock ? 'animate-spin' : ''}`} />
                    <span>Reset Stock to Initial</span>
                  </button>
                </div>
              </div>

              {resetMessage && (
                <div className="p-3 rounded-xl bg-[#286647]/10 border border-[#286647]/30 text-[#286647] text-xs font-medium">
                  {resetMessage}
                </div>
              )}

              <div className="space-y-2.5">
                {[
                  {
                    id: 'c1',
                    title: '1. Book Catalogue & Seed Data',
                    desc: 'Database seeded with 12 diverse books displaying title, author, price, category, description, and available stock.',
                  },
                  {
                    id: 'c2',
                    title: '2. Search & Category Filtering',
                    desc: 'Real-time keyword search by title or author, category filtering tabs, and clear empty states when no books match.',
                  },
                  {
                    id: 'c3',
                    title: '3. Out-of-Stock and Low-Stock Indicators',
                    desc: 'Distinct badges for "In Stock", "Only X left!", and "Out of Stock" (Astrophysics book) with disabled cart button.',
                  },
                  {
                    id: 'c4',
                    title: '4. Shopping Cart & Stock Limit Validation',
                    desc: 'Cart supports add, remove, and quantity updates. Prevents zero, negative, or quantities exceeding available stock.',
                  },
                  {
                    id: 'c5',
                    title: '5. Cart MongoDB Persistence & Customer Isolation',
                    desc: 'Cart stored in MongoDB under customer reference via JWT. Customers only have access to their own cart items.',
                  },
                  {
                    id: 'c6',
                    title: '6. Server-Side Price Calculation & Atomic Stock Decrement',
                    desc: 'POST /api/orders computes total using database prices (never client input) and executes atomic stock decrements with rollback guarantee.',
                  },
                  {
                    id: 'c7',
                    title: '7. Order Confirmation & Cart Clearance',
                    desc: 'Cart is cleared only after order creation succeeds. Order confirmation page displays order ID and breakdown.',
                  },
                  {
                    id: 'c8',
                    title: '8. Order History with Snapshot Preservation',
                    desc: 'GET /api/orders/me displays past orders with immutable snapshots of book title and purchase price.',
                  },
                ].map((item) => {
                  const checked = checklist[item.id] ?? false;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        checked ? 'bg-[#FFF8E8] border-[#6B352A]/50' : 'bg-[#FFFFFF] border-[#E6D8C5]'
                      }`}
                    >
                      <button className="mt-0.5 text-[#6B352A] focus:outline-hidden" aria-label="Toggle requirement">
                        {checked ? (
                          <CheckSquare className="w-5 h-5 text-[#6B352A]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#75665D]" />
                        )}
                      </button>
                      <div>
                        <span className={`font-bold block ${checked ? 'text-[#2B211D]' : 'text-[#75665D]'}`}>
                          {item.title}
                        </span>
                        <p className="text-xs text-[#75665D] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: API Documentation */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="font-bold font-editorial text-[#2B211D] text-base">
                Backend REST API Specification (10 Endpoints)
              </h3>
              <p className="text-xs text-[#75665D]">
                All customer routes require <code className="text-[#6B352A] font-semibold">Authorization: Bearer &lt;token&gt;</code> header.
              </p>
              <div className="overflow-x-auto rounded-xl border border-[#E6D8C5]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#FFF8E8] text-[#75665D] border-b border-[#E6D8C5]">
                    <tr>
                      <th className="p-2.5 font-bold">Method</th>
                      <th className="p-2.5 font-bold">Endpoint</th>
                      <th className="p-2.5 font-bold">Protection</th>
                      <th className="p-2.5 font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6D8C5] bg-[#FFFFFF]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#6B352A]">POST</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/auth/register</td>
                      <td className="p-2.5 text-[#75665D]">Public</td>
                      <td className="p-2.5">Registers new customer, hashes password with bcrypt, returns JWT.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#6B352A]">POST</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/auth/login</td>
                      <td className="p-2.5 text-[#75665D]">Public</td>
                      <td className="p-2.5">Verifies email &amp; bcrypt password, returns JWT token.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#286647]">GET</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/books</td>
                      <td className="p-2.5 text-[#75665D]">Public</td>
                      <td className="p-2.5">Retrieves book catalogue with regex sanitization; supports <code>?search</code>, <code>?category</code>, <code>?sort</code>.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#286647]">GET</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/books/:id</td>
                      <td className="p-2.5 text-[#75665D]">Public</td>
                      <td className="p-2.5">Retrieves single book details and real-time available stock.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#286647]">GET</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/cart</td>
                      <td className="p-2.5 font-bold text-[#6B352A]">JWT Protected</td>
                      <td className="p-2.5">Returns customer's shopping cart with populated books &amp; subtotal.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#6B352A]">POST</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/cart</td>
                      <td className="p-2.5 font-bold text-[#6B352A]">JWT Protected</td>
                      <td className="p-2.5">Adds book to cart. Validates available stock limit.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#75665D]">PUT</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/cart/:bookId</td>
                      <td className="p-2.5 font-bold text-[#6B352A]">JWT Protected</td>
                      <td className="p-2.5">Updates quantity. Rejects zero, negative, or excessive amounts.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#A52D2D]">DELETE</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/cart/:bookId</td>
                      <td className="p-2.5 font-bold text-[#6B352A]">JWT Protected</td>
                      <td className="p-2.5">Removes specific book item from authenticated customer's cart.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#6B352A]">POST</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/orders</td>
                      <td className="p-2.5 font-bold text-[#6B352A]">JWT Protected</td>
                      <td className="p-2.5">Performs atomic stock decrement, validates customer, snapshots prices, clears cart.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-[#286647]">GET</td>
                      <td className="p-2.5 font-mono text-[#2B211D]">/api/orders/me</td>
                      <td className="p-2.5 font-bold text-[#6B352A]">JWT Protected</td>
                      <td className="p-2.5">Returns list of historical orders for current customer.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Architecture & Concurrency */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-bold font-editorial text-[#2B211D] text-base">
                Architecture, Mongoose Schemas &amp; Concurrency Control
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FFF8E8] rounded-xl border border-[#E6D8C5]">
                  <h4 className="font-bold text-[#6B352A] mb-2 flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    <span>Mongoose Schemas</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#75665D] list-disc list-inside">
                    <li><strong className="text-[#2B211D]">User:</strong> name, email (unique regex), password (bcrypt), phone, address</li>
                    <li><strong className="text-[#2B211D]">Book:</strong> title, author, price, category, stock (min 0), rating, isbn</li>
                    <li><strong className="text-[#2B211D]">Cart:</strong> user (ObjectId ref), items: [book, quantity (min 1)]</li>
                    <li><strong className="text-[#2B211D]">Order:</strong> user, customer details, items: [snapshot title, price, quantity, subtotal], totalAmount, status</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FFF8E8] rounded-xl border border-[#E6D8C5]">
                  <h4 className="font-bold text-[#6B352A] mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Atomic Stock &amp; Overselling Prevention</span>
                  </h4>
                  <p className="text-xs text-[#75665D] leading-relaxed">
                    Stock reductions occur atomically during order checkout:
                  </p>
                  <pre className="mt-2 p-2 bg-[#FFFFFF] text-[#6B352A] rounded text-[11px] font-mono overflow-x-auto border border-[#E6D8C5]">
{`Book.findOneAndUpdate(
  { _id: item.book, stock: { $gte: item.quantity } },
  { $inc: { stock: -item.quantity } },
  { returnDocument: 'after' }
)`}
                  </pre>
                  <p className="text-xs text-[#75665D] mt-2">
                    If any item has insufficient stock or order creation fails, all changes are automatically rolled back.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Setup & Execution Instructions */}
          {activeTab === 'setup' && (
            <div className="space-y-4">
              <h3 className="font-bold font-editorial text-[#2B211D] text-base">
                Installation &amp; Execution Guide
              </h3>
              <div className="space-y-3 bg-[#FFF8E8] p-4 rounded-xl border border-[#E6D8C5]">
                <p className="text-xs text-[#2B211D]">
                  <strong>1. Environment Configuration:</strong>
                </p>
                <pre className="p-2.5 bg-[#FFFFFF] text-[#6B352A] rounded text-xs font-mono border border-[#E6D8C5]">
{`PORT=3000
MONGODB_URI="" # Leave empty for automatic embedded MongoDB!
JWT_SECRET="<generate-with: openssl rand -hex 64>"`}
                </pre>
                <p className="text-xs text-[#2B211D]">
                  <strong>2. Run Dev Server (Port 3000):</strong>
                </p>
                <pre className="p-2.5 bg-[#FFFFFF] text-[#6B352A] rounded text-xs font-mono border border-[#E6D8C5]">
npm run dev
                </pre>
                <p className="text-xs text-[#2B211D]">
                  <strong>3. Run Test Suites:</strong>
                </p>
                <pre className="p-2.5 bg-[#FFFFFF] text-[#6B352A] rounded text-xs font-mono border border-[#E6D8C5]">
npx tsx src/utils/cartCalculations.test.ts
npx tsx server/api.test.ts
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FFF8E8] border-t border-[#E6D8C5] flex items-center justify-between text-xs text-[#75665D]">
          <span>PETER Online Book Store • Last finish made by Jones JP</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#6B352A] text-white font-bold hover:bg-[#4D251F] transition cursor-pointer shadow-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
