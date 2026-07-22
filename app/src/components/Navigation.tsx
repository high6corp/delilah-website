import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center
          transition-all duration-300
          ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white/80 backdrop-blur-sm'}
        `}
      >
        <div className="w-full max-w-content mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-normal text-violet-900 hover:text-violet-700 transition-colors">
            Delilah&apos;s World
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200
                  ${isActive(link.path)
                    ? 'text-violet-500 border-b-2 border-violet-300 pb-0.5'
                    : 'text-slate-600 hover:text-violet-700'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Upload + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/upload"
              className="hidden lg:inline-flex items-center px-6 py-2.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97]"
            >
              Upload
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-violet-900 hover:text-violet-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-violet-50"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-violet-900 hover:text-violet-700 transition-colors"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 -mt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      font-display text-3xl transition-colors duration-200
                      ${isActive(link.path) ? 'text-violet-500' : 'text-violet-900 hover:text-violet-700'}
                    `}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.3 }}
              >
                <Link
                  to="/upload"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center px-8 py-3 bg-violet-500 text-white text-sm font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 transition-all duration-200"
                >
                  Upload
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}