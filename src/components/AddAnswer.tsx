'use client';

import { useAuthStore } from '@/store/Auth';
import { Document, Question } from '@/services/types';
import { MDEditor } from '@/components/MDEditor';
import React, { useActionState, useState } from 'react';
import { createAnswer } from '@/services/answerService';
import { useQuestionContext } from '@/context/QuestionContext';

type FormState = {
  error?: { message: string; error?: unknown };
  success?: boolean;
};

export function AddAnswer() {
  const [content, setContent] = useState('');
  const { user } = useAuthStore();
  const [question, setQuestion] = useQuestionContext();
  const questionId = question!.$id;

  const [{ error }, formAction, isPending] = useActionState<FormState, FormData>(
    createAnswerAction,
    {},
  );

  async function createAnswerAction(/*state: FormState, payload: FormData*/): Promise<FormState> {
    if (!user) {
      return {
        success: false,
        error: {
          message: 'To answer a question, you must first log in',
        },
      };
    }
    if (!content) {
      return {
        success: false,
        error: {
          message: 'Please fill out all the fields',
        },
      };
    }

    try {
      const result = await createAnswer({
        questionId,
        content,
        authorId: user!.$id as string,
        commentsRel: [],
        questionRel: questionId as unknown as Document<Question>,
      });

      setQuestion({
        ...question!,
        answersRel: [...question!.answersRel, { ...result, author: user! }],
      });

      setContent('');

      return { success: true };
    } catch (error) {
      // console.error(error);
      return {
        success: false,
        error: {
          message: 'Error creating answer',
          error,
        },
      };
    }
  }

  return (
    <>
      {error && (
        <p className="text-destructive dark:text-destructive mt-8 text-center text-sm">
          {error.message}
        </p>
      )}
      <form action={formAction} className="space-y-2">
        <h2 className="mb-4 text-xl">Your Answer</h2>
        <MDEditor value={content} onChange={(value) => setContent(value as string)} />

        <button
          className="bg-accent hover:bg-accent/30 rounded-md px-4 py-2 disabled:text-gray-400"
          disabled={!Boolean(content) && !isPending}
        >
          Post Your Answer
        </button>
      </form>
    </>
  );
}
