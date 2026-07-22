import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Send, MessageSquare } from 'lucide-react';
import CommentBox from '@/components/CommentBox';
import VideoPlayer from '@/components/VideoPlayer';
import * as mediaApi from '@/api/media';
import * as commentsApi from '@/api/comments';
import { formatDate, getFileUrl, getThumbnailUrl } from '@/lib/media';
import type { MediaItem, Comment } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import DeleteButton from '@/components/DeleteButton';

export default function MediaDetail() {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [item, setItem] = useState<MediaItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (!mediaId) return;
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await mediaApi.getMedia(mediaId!);
        if (!cancelled) {
          setItem(data);
          setComments(data.comments ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load memory');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [mediaId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !mediaId) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await commentsApi.addMediaComment(
        mediaId,
        commentName.trim(),
        commentText.trim()
      );
      setComments(prev => [...prev, newComment]);
      setCommentText('');
      addToast('Comment posted!', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to post comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!mediaId) return;
    try {
      await mediaApi.deleteMedia(mediaId);
      addToast('Memory deleted', 'success');
      navigate('/gallery');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete memory', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl text-violet-900">Memory not found</h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => navigate('/gallery')}
            className="mt-4 text-sm text-violet-500 hover:underline"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px]">
      <section className="bg-white py-12 md:py-16 px-6">
        <div className="max-w-narrow mx-auto">
          {/* Back Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/gallery')}
              className="flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-700 hover:underline transition-colors"
            >
              <ArrowLeft size={16} /> Back to gallery
            </button>
            <DeleteButton itemName="memory" onDelete={handleDelete} variant="page" />
          </div>

          {/* Media Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className={`
              inline-flex px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] rounded-pill mb-3
              ${item.type === 'PHOTO' ? 'bg-violet-100 text-violet-700' : 'bg-purple-100 text-purple-700'}
            `}>
              {item.type === 'PHOTO' ? 'Photo' : 'Video'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-violet-900 leading-tight">{item.title}</h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-xs font-medium text-violet-700">
                  {item.uploaderName.charAt(0)}
                </div>
                <span className="text-sm text-slate-600">{item.uploaderName}</span>
              </div>
              <span className="text-sm text-slate-400">{formatDate(item.createdAt)}</span>
            </div>
          </motion.div>

          <div className="border-t border-violet-100 my-8" />

          {/* Media Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {item.type === 'PHOTO' ? (
              <img
                src={getFileUrl(item.id)}
                alt={item.title}
                className="w-full rounded-card shadow-md object-cover max-h-[500px]"
              />
            ) : (
              <div className="relative rounded-card overflow-hidden shadow-md">
                <img
                  src={getThumbnailUrl(item)}
                  alt={item.title}
                  className="w-full object-cover max-h-[500px]"
                />
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-glow transition-all">
                    <Play size={24} className="text-violet-500 ml-0.5" fill="#7B5FB5" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>

          {/* Description */}
          {item.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-8 text-lg text-slate-600 leading-relaxed"
            >
              {item.description}
            </motion.p>
          )}

          {/* Footer */}
          <div className="border-t border-violet-100 mt-8 pt-6">
            <p className="font-accent text-xl text-violet-500">
              Shared with love for Delilah
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t border-violet-100 mt-10 pt-10">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-violet-500" />
              <h2 className="font-display text-3xl text-violet-900">Comments</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </p>

            {/* Comment List */}
            <div className="mt-6 space-y-3">
              {comments.map(comment => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommentBox comment={comment} />
                </motion.div>
              ))}
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
        </div>
      </section>

      {/* Video Player Modal */}
      {showVideo && item.type === 'VIDEO' && (
        <VideoPlayer
          src={getFileUrl(item.id)}
          poster={getThumbnailUrl(item)}
          title={item.title}
          onClose={() => setShowVideo(false)}
        />
      )}
    </div>
  );
}
