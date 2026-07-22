import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaCard from '@/components/MediaCard';
import * as mediaApi from '@/api/media';
import { filterToApiType } from '@/lib/media';
import { useToast } from '@/contexts/ToastContext';
import type { GalleryFilter, MediaItem } from '@/types';

const filters: { key: GalleryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'photos', label: 'Photos' },
  { key: 'videos', label: 'Videos' },
];

export default function Gallery() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('all');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await mediaApi.listMedia(filterToApiType(activeFilter));
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load memories');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeFilter]);

  const filtered = useMemo(() => items, [items]);
  const hasContent = items.length > 0;

  const handleDelete = async (item: MediaItem) => {
    try {
      await mediaApi.deleteMedia(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      addToast('Memory deleted', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete memory', 'error');
    }
  };

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section
        className="py-16 md:py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #F7F2FB 0%, #F0EBF7 100%)' }}
      >
        <div className="max-w-content mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500"
          >
            Gallery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-5xl md:text-6xl text-violet-900 mt-3"
          >
            Family Memories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-slate-600 max-w-lg"
          >
            All the photos and videos your family has shared. Tap any one to see it bigger!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mt-8"
          >
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                disabled={isLoading}
                className={`
                  px-5 py-2 text-xs font-medium uppercase tracking-[0.08em] rounded-pill transition-all duration-200
                  disabled:opacity-50
                  ${activeFilter === f.key
                    ? 'bg-violet-500 text-white'
                    : 'border-[1.5px] border-violet-300 text-violet-500 hover:bg-violet-50'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white py-section px-6">
        <div className="max-w-content mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-sm text-slate-500">Loading memories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : !hasContent ? (
            <div className="text-center py-20">
              <Star size={48} className="text-violet-300 mx-auto animate-float" />
              <h2 className="font-display text-3xl text-violet-900 mt-5">No memories yet</h2>
              <p className="mt-2 text-base text-slate-600">Be the first to share a photo or video with Delilah!</p>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 mt-5"
              >
                <Upload size={14} className="mr-2" />
                Upload Something
              </Link>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.08, 0.5), duration: 0.4 }}
                  >
                    <MediaCard
                      item={item}
                      onClick={() => navigate(`/gallery/${item.id}`)}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
