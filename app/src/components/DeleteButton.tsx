import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteButtonProps {
  itemName: string;
  onDelete: () => void | Promise<void>;
  disabled?: boolean;
  variant?: 'card' | 'page';
}

export default function DeleteButton({ itemName, onDelete, disabled, variant = 'card' }: DeleteButtonProps) {
  const isPage = variant === 'page';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
          className={`
            inline-flex items-center gap-1.5 rounded transition-colors disabled:opacity-50
            ${isPage
              ? 'px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100'
              : 'p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 bg-white/80 backdrop-blur-sm'
            }
          `}
        >
          <Trash2 size={isPage ? 14 : 16} />
          {isPage && <span>Delete</span>}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The {itemName.toLowerCase()} will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
