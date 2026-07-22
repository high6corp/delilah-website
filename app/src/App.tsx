import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import PasswordGate from '@/components/PasswordGate';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import MediaDetail from '@/pages/MediaDetail';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Upload from '@/pages/Upload';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:mediaId" element={<MediaDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ScrollToTop />
        <PasswordGate />
        <div className="min-h-screen flex flex-col bg-white">
          <Navigation />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;