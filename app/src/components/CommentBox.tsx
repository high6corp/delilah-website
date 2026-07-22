import type { Comment } from '@/types';
import { formatDate } from '@/lib/media';

interface CommentBoxProps {
  comment: Comment;
}

function SingleComment({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const displayDate = comment.createdAt ? formatDate(comment.createdAt) : '';

  return (
    <div className={`${!isReply ? 'mb-4 last:mb-0' : ''}`}>
      <div className={`
        flex gap-3 p-4 rounded-card
        ${comment.isDelilah ? 'bg-violet-50 border-l-[3px] border-violet-500' : 'bg-slate-50'}
      `}>
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${comment.isDelilah ? 'bg-violet-500 text-white' : 'bg-violet-200 text-violet-700'}
          text-sm font-medium
        `}>
          {comment.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${comment.isDelilah ? 'text-violet-900' : 'text-slate-900'}`}>
              {comment.name}
              {comment.isDelilah && (
                <span className="ml-1.5 text-[10px] font-medium text-violet-500 bg-violet-100 px-1.5 py-0.5 rounded-pill uppercase tracking-wide">
                  Delilah
                </span>
              )}
            </span>
            {displayDate && <span className="text-xs text-slate-400">{displayDate}</span>}
          </div>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{comment.text}</p>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-3 pl-4 border-l-2 border-violet-100 space-y-3">
          {comment.replies.map(reply => (
            <SingleComment key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentBox({ comment }: CommentBoxProps) {
  return <SingleComment comment={comment} />;
}
