import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const footerLinks = [
  { path: '/', label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-lavender-mist">
      <div className="max-w-content mx-auto px-6 py-section-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-violet-900">Delilah&apos;s World</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              A special place where family memories come alive for Delilah.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-slate-600 hover:text-violet-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Family */}
          <div>
            <p className="font-accent text-xl text-violet-600">
              Made with love for Delilah
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-slate-400">
              <Heart size={14} className="text-violet-400" />
              <span className="text-sm">A family project</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-violet-100 mt-10 pt-6">
          <p className="text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} &mdash; Made with care for Delilah
          </p>
        </div>
      </div>
    </footer>
  );
}