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
import { useRouter } from 'next/navigation';
import { deleteQuestion } from '@/services/questionService';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export function DeleteQuestion({ questionId, authorId }: { questionId: string; authorId: string }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);

  if (!user || authorId !== user.$id) {
    return null;
  }

  function handleDelete() {
    deleteQuestion(questionId)
      .then(() => {
        router.push('/forum/questions');
      })
      .catch((reason) => {
        ref.current?.click();
        toast.error(reason.message ?? 'Error deleting question');
      });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger title="Delete question">
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your question and it cannot
            be undone.
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
