import { Star } from 'lucide-react';

export default function StarDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-10">
      <Star size={16} className="text-violet-300 animate-twinkle" fill="#A78BDB" />
      <Star size={16} className="text-violet-300 animate-twinkle-delay-1" fill="#A78BDB" />
      <Star size={16} className="text-violet-300 animate-twinkle-delay-2" fill="#A78BDB" />
    </div>
  );
}