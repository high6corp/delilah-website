import { Star } from 'lucide-react';

interface NoImagePlaceholderProps {
  className?: string;
}

export default function NoImagePlaceholder({ className = '' }: NoImagePlaceholderProps) {
  return (
    <div className={`bg-violet-100 flex items-center justify-center ${className}`}>
      <Star size={32} className="text-violet-300" />
    </div>
  );
}