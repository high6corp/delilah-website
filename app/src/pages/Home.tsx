import { motion } from 'framer-motion';
import { ChevronDown, Camera, Play, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import StarDivider from '@/components/StarDivider';
import MediaCard from '@/components/MediaCard';
import BlogCard from '@/components/BlogCard';
import * as mediaApi from '@/api/media';
import * as storiesApi from '@/api/stories';
import type { MediaItem, BlogPost } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const [showScroll, setShowScroll] = useState(true);
  const [latestMedia, setLatestMedia] = useState<MediaItem[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const [media, stories] = await Promise.all([
          mediaApi.listMedia(),
          storiesApi.listStories(),
        ]);
        if (!cancelled) {
          setLatestMedia(media.slice(0, 3));
          setLatestPosts(stories.slice(0, 2));
        }
      } catch {
        // ignore; home page should still render
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const features = [
    { icon: Camera, title: 'See Photos', desc: 'Browse beautiful family photos in the gallery' },
    { icon: Play, title: 'Watch Videos', desc: 'Enjoy fun videos from family moments' },
    { icon: BookOpen, title: 'Read Stories', desc: 'Read stories and messages from loved ones' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="min-h-[100dvh] flex flex-col items-center justify-center relative px-6"
        style={{ background: 'linear-gradient(135deg, #F7F2FB 0%, #F0EBF7 100%)' }}
      >
        <div className="max-w-narrow text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500 mb-4"
          >
            Welcome to
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
            className="font-display text-5xl md:text-6xl text-violet-900 leading-[1.1]"
          >
            Delilah&apos;s World
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 text-base md:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed"
          >
            A special place where family memories come alive. Watch videos, see photos, and read stories made just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              to="/gallery"
              className="px-8 py-3.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97]"
            >
              Explore Gallery
            </Link>
            <Link
              to="/blog"
              className="px-8 py-3.5 border-[1.5px] border-violet-300 text-violet-500 text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-50 hover:border-violet-500 transition-all duration-200"
            >
              Read Stories
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {showScroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ChevronDown size={24} className="text-violet-300 animate-bounce-slow" />
          </motion.div>
        )}
      </section>

      {/* Latest Memories Section */}
      <section className="bg-white py-section px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500">Latest Memories</p>
            <h2 className="font-display text-4xl md:text-5xl text-violet-900 mt-3">New from Your Family</h2>
            <p className="mt-3 text-base text-slate-600">The newest photos and videos shared just for you</p>
          </ScrollReveal>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {latestMedia.map((item, i) => (
                  <ScrollReveal key={item.id} delay={i * 0.15}>
                    <MediaCard item={item} onClick={() => navigate(`/gallery/${item.id}`)} />
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={0.3} className="text-center mt-10">
                <Link to="/gallery" className="text-sm text-violet-500 hover:text-violet-700 hover:underline transition-colors">
                  View all memories &rarr;
                </Link>
              </ScrollReveal>
            </>
          )}
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="bg-violet-50 py-section px-6">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500">Family Stories</p>
            <h2 className="font-display text-4xl md:text-5xl text-violet-900 mt-3">Stories for Delilah</h2>
          </ScrollReveal>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              <div className="space-y-8 mt-12">
                {latestPosts.map((post, i) => (
                  <ScrollReveal key={post.id} delay={i * 0.15}>
                    <BlogCard post={post} onClick={() => navigate(`/blog?post=${post.id}`)} />
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={0.3} className="text-center mt-10">
                <Link to="/blog" className="text-sm text-violet-500 hover:text-violet-700 hover:underline transition-colors">
                  Read all stories &rarr;
                </Link>
              </ScrollReveal>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-section px-6">
        <div className="max-w-narrow mx-auto text-center">
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500">About</p>
            <h2 className="font-display text-4xl md:text-5xl text-violet-900 mt-3">Made with Love, Just for You</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-6 text-lg text-slate-600 leading-[1.7] max-w-2xl mx-auto">
              This is your very own place on the internet, Delilah. Here, Mom Miracle and your family can share photos, videos, and stories with you. You can look at all the fun memories, leave comments, and even upload your own pictures someday. Everything here is made to make you smile.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <StarDivider />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <feature.icon size={22} className="text-violet-500" />
                  </div>
                  <h3 className="font-display text-xl text-violet-900 mt-4">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upload CTA Section */}
      <section className="bg-lavender-mist py-section-sm px-6">
        <div className="max-w-narrow mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-violet-900">Want to Share Something Special?</h2>
            <p className="mt-3 text-base text-slate-600">
              Family members can upload photos, videos, and stories for Delilah to enjoy.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center px-8 py-3.5 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97] mt-6"
            >
              Upload Memories
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
