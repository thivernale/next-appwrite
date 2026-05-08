'use client';

import { MDEditor } from '@/components/MDEditor';
import { useQuestionContext } from '@/context/QuestionContext';
import { createAnswer } from '@/services/answerService';
import { Document, Question } from '@/services/types';
import { populateAuthorUserPrefs } from '@/services/userPrefs';
import { useAuthStore } from '@/store/Auth';
import React, { useActionState, useState } from 'react';

type FormState = {
  error?: { message: string; error?: unknown };
  success?: boolean;
};

export function AddAnswer() {
  const [content, setContent] = useState('');
  const { user, updateUserPreferences } = useAuthStore();
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
    if (!content || !question) {
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
        authorId: user.$id,
        commentsRel: [],
        questionRel: questionId as unknown as Document<Question>,
      });

      user.prefs.reputation = Number(user.prefs.reputation) + 1;
      await updateUserPreferences(user.prefs);

      question.answersRel = [...(question.answersRel ?? []), { ...result, author: user }];

      setQuestion(populateAuthorUserPrefs(question, user.$id, user.prefs));

      setContent(() => '');

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : {
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
          disabled={!content || isPending}
        >
          Post Your Answer
        </button>
      </form>
    </>
  );
}
