import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  onClose: () => void;
}

export default function VideoPlayer({ src, poster, title, onClose }: VideoPlayerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
          aria-label="Close video"
        >
          <X size={28} />
        </button>
        <div className="rounded-card overflow-hidden bg-black shadow-lg">
          <video
            controls
            autoPlay
            poster={poster}
            className="w-full aspect-video"
            src={src}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        {title && <p className="mt-3 text-white/90 text-sm font-medium">{title}</p>}
      </motion.div>
    </motion.div>
  );
}