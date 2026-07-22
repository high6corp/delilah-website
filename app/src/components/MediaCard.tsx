import { Play } from 'lucide-react';
import type { MediaItem } from '@/types';
import { formatDate, getThumbnailUrl } from '@/lib/media';
import DeleteButton from './DeleteButton';

interface MediaCardProps {
  item: MediaItem;
  onClick?: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void | Promise<void>;
}

export default function MediaCard({ item, onClick, onDelete }: MediaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="bg-white rounded-card shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group text-left w-full relative"
    >
      {onDelete && (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <DeleteButton
            itemName="memory"
            onDelete={() => onDelete(item)}
          />
        </div>
      )}
      <div className="relative aspect-[4/3] overflow-hidden bg-violet-100">
        <img
          src={getThumbnailUrl(item)}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.type === 'VIDEO' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 shadow-md flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-200">
              <Play size={20} className="text-violet-500 ml-0.5" fill="#7B5FB5" />
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-violet-900 leading-tight">{item.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
          <span className="text-xs text-violet-500 font-medium">by {item.uploaderName}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.description ?? ''}</p>
      </div>
    </button>
  );
}
