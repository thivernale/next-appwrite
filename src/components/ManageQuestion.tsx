'use client';

import { MDEditor } from '@/components/MDEditor';
import React, { useActionState, useRef, useState } from 'react';
import { useAuthStore } from '@/store/Auth';
import { Document, Question } from '@/services/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAttachment, deleteAttachment } from '@/services/storageService';
import { createQuestion, updateQuestion } from '@/services/questionService';
import { useRouter } from 'next/navigation';
import { slugify } from '@/utils/slugify';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppwriteException } from 'appwrite';

const FormControlContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`relative flex w-full flex-col space-y-2 overflow-hidden p-1`, className)}>
      {children}
    </div>
  );
};

type FormState = {
  error?: { message: string; error?: unknown };
  success?: boolean;
};

export function ManageQuestion({ question: initialQuestion }: { question?: Document<Question> }) {
  const id = initialQuestion?.$id;

  const [question, setQuestion] = useState<Question>({
    title: initialQuestion?.title ?? '',
    content: initialQuestion?.content ?? '',
    tags: initialQuestion?.tags ?? [],
    attachmentId: initialQuestion?.attachmentId ?? '',
    authorId: initialQuestion?.authorId ?? '',
  });

  const [tag, setTag] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  const [{ error }, formAction, isPending] = useActionState<FormState, FormData>(
    createQuestionAction,
    {},
  );

  async function createQuestionAction(/*state: FormState, payload: FormData*/): Promise<FormState> {
    if (!user) {
      return {
        success: false,
        error: {
          message: 'To ask a question, you must first log in',
        },
      };
    }
    if (!question.title || !question.content /* || !fileRef.current!.files?.length*/) {
      return {
        success: false,
        error: {
          message: 'Please fill out all required fields',
        },
      };
    }

    try {
      if (fileRef.current!.files?.length) {
        if (id && question.attachmentId) {
          try {
            await deleteAttachment(question.attachmentId);
          } catch (e) {
            if (e instanceof AppwriteException && e.code === 404) {
              // file not found is ok
            } else {
              throw e;
            }
          }
        }

        const file = await createAttachment(fileRef.current!.files[0]);
        question.attachmentId = file.$id;
      }
      question.authorId = user.$id;

      const result = !id ? await createQuestion(question) : await updateQuestion(id, question);
      router.push(`/forum/questions/${result.$id}/${slugify(question.title)}`);

      return { success: true };
    } catch (error) {
      //console.error(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : {
                message: 'Error saving question',
                error,
              },
      };
    }
  }

  function setProp(prop: keyof Question, val: unknown) {
    setQuestion({
      ...question,
      [prop]: val,
    });
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {error && (
        <p className="text-destructive dark:text-destructive mt-8 text-center text-sm">
          {error.message}
        </p>
      )}
      <form action={formAction} className="space-y-4">
        <FormControlContainer>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="Write a title..."
            value={question.title}
            onChange={(e) => setProp('title', e.target.value)}
          />
        </FormControlContainer>
        <FormControlContainer>
          <Label htmlFor="content">Describe the details of your question</Label>
          <MDEditor
            value={question.content}
            onChange={(value) => setProp('content', value as string)}
          />
        </FormControlContainer>
        <FormControlContainer>
          <Label htmlFor="file">Image</Label>
          <Input
            type="file"
            name="file"
            id="file"
            placeholder="Select an image for upload..."
            accept="image/*"
            ref={fileRef}
          />
        </FormControlContainer>
        <FormControlContainer>
          <Label htmlFor="tag">Tags</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              name="tag"
              id="tag"
              placeholder="Specify a tag..."
              className="w-full"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />{' '}
            <button
              type="button"
              className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2"
              onClick={() => {
                setProp('tags', [...question.tags, tag]);
                setTag('');
              }}
            >
              Add tag
            </button>
          </div>
          <div className="m-1 flex items-center gap-2">
            {question.tags.map((tag) => (
              <span
                className="bg-accent hover:bg-accent/30 align-center flex gap-2 rounded-full px-2 py-2 outline"
                key={tag}
              >
                {tag}
                <button
                  onClick={() => {
                    setProp('tags', [...question.tags.filter((value) => value !== tag)]);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </FormControlContainer>
        <button
          className="bg-accent hover:bg-accent/30 rounded-md px-4 py-2 disabled:text-gray-400"
          disabled={!(question.title && question.content) || isPending}
        >
          {id ? 'Update' : 'Publish'}
        </button>
      </form>
    </div>
  );
}
