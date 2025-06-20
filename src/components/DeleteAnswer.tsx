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
import { useAuthStore } from '@/store/Auth';
import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { deleteAnswer } from '@/services/answerService';

export function DeleteAnswer({
  answerId,
  authorId,
  onDelete = () => {},
}: {
  answerId: string;
  authorId: string;
  onDelete: () => void;
}) {
  const { user, updateUserPreferences } = useAuthStore();
  const ref = useRef<HTMLButtonElement | null>(null);

  if (!user || authorId !== user.$id) {
    return null;
  }

  function handleDelete() {
    if (!user) {
      return;
    }
    deleteAnswer(answerId)
      .then(() => {
        user.prefs.reputation = Number(user.prefs.reputation) - 1;
        return updateUserPreferences(user.prefs);
      })
      .then(() => {
        onDelete();
      })
      .catch((reason) => {
        ref.current?.click();
        toast.error(reason.message ?? 'Error deleting answer');
      });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger title="Delete answer">
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your answer and it cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
