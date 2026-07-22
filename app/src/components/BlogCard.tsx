import type { BlogPost } from '@/types';
import { formatDate } from '@/lib/media';
import DeleteButton from './DeleteButton';

interface BlogCardProps {
  post: BlogPost;
  onClick?: (postId: string) => void;
  onDelete?: (postId: string) => void | Promise<void>;
}

function makeExcerpt(content: string, maxLength = 140): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '...';
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export default function BlogCard({ post, onClick, onDelete }: BlogCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(post.id)}
      className="bg-white rounded-card shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col md:flex-row text-left w-full relative"
    >
      {onDelete && (
        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
          <DeleteButton itemName="story" onDelete={() => onDelete(post.id)} />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <span className="inline-flex self-start px-3 py-1 bg-violet-100 text-violet-700 text-[10px] font-medium uppercase tracking-[0.08em] rounded-pill mb-3">
          {post.category}
        </span>
        <h3 className="font-display text-2xl text-violet-900 leading-tight line-clamp-2">{post.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">{makeExcerpt(post.content)}</p>
        <div className="mt-auto pt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-xs font-medium text-violet-700">
              {post.authorName.charAt(0)}
            </div>
            <span className="text-xs text-slate-600">{post.authorName}</span>
          </div>
          <span className="text-xs text-slate-400">{formatDate(post.createdAt)}</span>
          <span className="text-xs text-slate-400">{estimateReadTime(post.content)} read</span>
        </div>
        <span className="mt-3 text-xs text-violet-500 font-medium group-hover:underline inline-flex items-center gap-1">
          Read story &rarr;
        </span>
      </div>
    </button>
  );
}
