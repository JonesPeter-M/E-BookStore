import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register, openAuthModal } = useAuth();
  const isLogin = authModalMode === 'login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (!isLogin && (!name || name.trim().length < 2)) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          phone,
          address,
          city,
          postalCode,
        });
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@bookstore.test');
    setPassword('password123');
    setFormError(null);
  };

  return (
    <div
      className="fixed inset-0 z-[1100] overflow-y-auto bg-[#2B211D]/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative bg-[#FFFFFF] text-[#2B211D] rounded-2xl max-w-md w-full shadow-2xl border border-[#E6D8C5] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#FFF8E8] hover:bg-[#E6D8C5] text-[#75665D] hover:text-[#2B211D] flex items-center justify-center transition cursor-pointer border border-[#E6D8C5]"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header & Tabs */}
        <div className="pt-8 px-6 pb-4 bg-[#FFF8E8] border-b border-[#E6D8C5] text-center">
          <div className="w-12 h-12 rounded-xl bg-[#6B352A] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold font-editorial text-[#2B211D]">
            {isLogin ? 'Reader Sign In' : 'Create Reader Account'}
          </h2>
          <p className="text-xs text-[#75665D] mt-1">
            {isLogin
              ? 'Access your course books, saved cart, and order history'
              : 'Join PETER Book Store to reserve books and track deliveries'}
          </p>

          {/* Quick Demo Login Preset Button */}
          {isLogin && (
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1A6] text-[#6B352A] hover:bg-[#FFF1A6]/80 transition cursor-pointer border border-[#E6D8C5] shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-fill Demo Account (demo@bookstore.test)</span>
            </button>
          )}

          {/* Tab Switcher */}
          <div className="mt-4 flex p-1 bg-[#FFFFFF] rounded-xl border border-[#E6D8C5]">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                isLogin ? 'bg-[#6B352A] text-white shadow-xs' : 'text-[#75665D] hover:text-[#2B211D]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                !isLogin ? 'bg-[#6B352A] text-white shadow-xs' : 'text-[#75665D] hover:text-[#2B211D]'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {formError && (
            <div className="p-3 rounded-xl bg-[#A52D2D]/10 border border-[#A52D2D]/30 text-[#A52D2D] text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#A52D2D] shrink-0 mt-0.5" />
              <span className="font-medium">{formError}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#75665D] mb-1">
                Full Name <span className="text-[#A52D2D]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
                />
                <User className="w-4 h-4 text-[#75665D] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#75665D] mb-1">
              Email Address <span className="text-[#A52D2D]">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
              />
              <Mail className="w-4 h-4 text-[#75665D] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#75665D] mb-1">
              Password <span className="text-[#A52D2D]">* (min. 6 characters)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
              />
              <Lock className="w-4 h-4 text-[#75665D] absolute left-3 top-2.5" />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#75665D] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
                  />
                  <Phone className="w-4 h-4 text-[#75665D] absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#75665D] mb-1">
                  Campus / Delivery Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 University Ave, Dorm 4B"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
                  />
                  <MapPin className="w-4 h-4 text-[#75665D] absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#75665D] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cambridge"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#75665D] mb-1">
                    Postal / ZIP
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="02138"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Account' : 'Register & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
