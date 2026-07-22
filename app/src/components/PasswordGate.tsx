import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiRequestError } from '@/api/client';
import { Checkbox } from '@/components/ui/checkbox';

export default function PasswordGate() {
  const { isAuthenticated, isLoading, authenticate } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Wrong password. Try again!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(false);
    setErrorMessage('Wrong password. Try again!');
    setIsSubmitting(true);
    try {
      const success = await authenticate(password, rememberMe);
      if (success) {
        setIsExiting(true);
      } else {
        setError(true);
        setPassword('');
        setTimeout(() => setError(false), 500);
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.statusCode === 401) {
        setErrorMessage('Wrong password. Try again!');
      } else if (err instanceof ApiRequestError) {
        setErrorMessage(err.message || 'Server error. Please try again later.');
      } else {
        setErrorMessage('Unable to connect. Please check your network.');
      }
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-violet-50">
        <div className="text-violet-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && !isExiting) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onAnimationComplete={() => {
        if (isExiting) setIsExiting(false);
      }}
      className={`fixed inset-0 z-[200] flex items-center justify-center ${isExiting ? 'pointer-events-none' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #EDE5F5 0%, #F0EBF7 50%, #F7F2FB 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 8s ease infinite',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-[400px] mx-6"
      >
        <div className={`bg-white rounded-card shadow-lg p-8 md:p-10 ${error ? 'animate-shake' : ''}`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center mb-5">
              <Lock size={24} className="text-violet-500" />
            </div>

            <h2 className="font-display text-3xl text-violet-900">Welcome to Delilah&apos;s World</h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Enter the family password to continue
            </p>

            <form onSubmit={handleSubmit} className="w-full mt-6">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Family password"
                  disabled={isSubmitting}
                  className={`
                    w-full px-4 py-3.5 pr-12 rounded-input border-[1.5px] text-sm
                    placeholder:text-slate-400 outline-none transition-all duration-200
                    disabled:opacity-60
                    ${error
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-300 focus:border-violet-500 focus:shadow-glow'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-slate-600 cursor-pointer select-none"
                >
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Entering...' : 'Enter'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 font-accent">
          A special place made with love
        </p>
      </motion.div>
    </motion.div>
  );
}
