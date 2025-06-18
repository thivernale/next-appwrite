'use client';

import React, { useActionState, useState } from 'react';
import { useAuthStore } from '@/store/Auth';

type FormState = {
  error?: { message: string; error?: unknown };
  success?: boolean;
};

export function AddComment({ onSubmit }: { onSubmit: (arg0: string) => Promise<void> }) {
  const [content, setContent] = useState('');
  const { user } = useAuthStore();

  const [{ error }, formAction, isPending] = useActionState<FormState, FormData>(
    createCommentAction,
    {},
  );

  async function createCommentAction(/*state: FormState, payload: FormData*/): Promise<FormState> {
    if (!user) {
      return {
        success: false,
        error: {
          message: 'To post a comment, you must first log in',
        },
      };
    }
    if (!content) {
      return {
        success: false,
        error: {
          message: 'Please write a comment to post',
        },
      };
    }

    try {
      await onSubmit(content);

      setContent('');

      return { success: true };
    } catch (error) {
      // console.error(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : {
                message: 'Error creating comment',
                error,
              },
      };
    }
  }

  return (
    <>
      {error && (
        <p className="text-destructive dark:text-destructive mt-2 text-center text-sm">
          {error.message}
        </p>
      )}
      <form action={formAction} className="flex items-center gap-2">
        <textarea
          name="content"
          placeholder="Write a comment..."
          className="border-accent-foreground/20 bg-background/10 w-full rounded-md border p-2 outline-none"
          rows={1}
          value={content}
          onChange={(event) => setContent(() => event.target.value)}
        ></textarea>
        <button
          className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2 font-bold disabled:text-gray-400"
          disabled={!Boolean(content) || isPending}
        >
          Add Comment
        </button>
      </form>
    </>
  );
}
