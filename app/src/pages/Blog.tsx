import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BookOpen, MessageSquare, Send } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import BlogCard from '@/components/BlogCard';
import CommentBox from '@/components/CommentBox';
import DeleteButton from '@/components/DeleteButton';
import * as storiesApi from '@/api/stories';
import * as commentsApi from '@/api/comments';
import { formatDate } from '@/lib/media';
import type { BlogPost } from '@/types';
import { useToast } from '@/contexts/ToastContext';

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedPostId = searchParams.get('post');

  useEffect(() => {
    if (selectedPostId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedPostId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await storiesApi.listStories();
        if (!cancelled) setPosts(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load stories');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { addToast } = useToast();

  const postComments = selectedPost?.comments ?? [];

  const handleDelete = async (postId: string) => {
    try {
      await storiesApi.deleteStory(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (selectedPostId === postId) {
        setSearchParams({});
      }
      addToast('Story deleted', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete story', 'error');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !selectedPostId) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await commentsApi.addStoryComment(
        selectedPostId,
        commentName.trim(),
        commentText.trim()
      );
      setPosts(prev => prev.map(post => {
        if (post.id !== selectedPostId) return post;
        return {
          ...post,
          comments: [...(post.comments ?? []), newComment],
        };
      }));
      setCommentText('');
      addToast('Comment posted!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to post comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

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
            Family Stories
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-5xl md:text-6xl text-violet-900 mt-3"
          >
            Stories for Delilah
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-slate-600 max-w-lg"
          >
            Words written with love. Read stories, messages, and updates from your family.
          </motion.p>
        </div>
      </section>

      <section className="bg-white py-section px-6">
        <div className="max-w-content mx-auto">
          {error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {selectedPost ? (
                <motion.div
                  key="post"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-narrow mx-auto"
                >
                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => { setSearchParams({}); }}
                      className="flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-700 hover:underline transition-colors"
                    >
                      <ArrowLeft size={16} /> Back to stories
                    </button>
                    <DeleteButton
                      itemName="story"
                      onDelete={() => handleDelete(selectedPost.id)}
                      variant="page"
                    />
                  </div>

                  {/* Post Header */}
                  <span className="inline-flex px-3 py-1 bg-violet-100 text-violet-700 text-[10px] font-medium uppercase tracking-[0.08em] rounded-pill">
                    {selectedPost.category}
                  </span>
                  <h1 className="font-display text-4xl md:text-5xl text-violet-900 mt-4 leading-tight">
                    {selectedPost.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-xs font-medium text-violet-700">
                        {selectedPost.authorName.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600">{selectedPost.authorName}</span>
                    </div>
                    <span className="text-sm text-slate-400">{formatDate(selectedPost.createdAt)}</span>
                    <span className="text-sm text-slate-400">{estimateReadTime(selectedPost.content)} read</span>
                  </div>
                  <div className="border-t border-violet-100 my-8" />

                  {/* Post Content */}
                  <div className="prose-violet max-w-none">
                    {selectedPost.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-lg text-slate-900 leading-[1.8] mb-6">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Post Footer */}
                  <div className="border-t border-violet-100 mt-10 pt-8">
                    <p className="font-accent text-xl text-violet-500">
                      Written with love for Delilah
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-violet-100 mt-12 pt-10">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={20} className="text-violet-500" />
                      <h2 className="font-display text-3xl text-violet-900">Comments</h2>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {postComments.length} comment{postComments.length !== 1 ? 's' : ''}
                    </p>

                    {/* Comment List */}
                    <div className="mt-6 space-y-3">
                      <AnimatePresence>
                        {postComments.map(comment => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CommentBox comment={comment} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="mt-8 bg-violet-50 rounded-card p-6">
                      <h3 className="font-display text-xl text-violet-900 mb-4">Leave a comment</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={commentName}
                            onChange={e => setCommentName(e.target.value)}
                            placeholder="Who are you?"
                            required
                            className="w-full px-4 py-3 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                            Your Comment
                          </label>
                          <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Write something nice..."
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all resize-vertical"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmittingComment}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-700 hover:shadow-glow transition-all duration-200 active:scale-[0.97] disabled:opacity-70"
                        >
                          <Send size={14} />
                          {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-narrow mx-auto space-y-8"
                >
                  {posts.length === 0 ? (
                    <div className="text-center py-20">
                      <BookOpen size={48} className="text-violet-300 mx-auto" />
                      <h2 className="font-display text-3xl text-violet-900 mt-5">No stories yet</h2>
                      <p className="mt-2 text-base text-slate-600">Write the first story for Delilah to read!</p>
                    </div>
                  ) : (
                    posts.map((post, i) => (
                      <ScrollReveal key={post.id} delay={i * 0.1}>
                        <BlogCard
                          post={post}
                          onClick={(id) => { setSearchParams({ post: id }); }}
                          onDelete={handleDelete}
                        />
                      </ScrollReveal>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
