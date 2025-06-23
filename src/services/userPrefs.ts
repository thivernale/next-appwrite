import { Document, Question } from '@/services/types';
import { UserPreferences } from '@/store/Auth';

export function populateAuthorUserPrefs(
  question: Document<Question>,
  authorId: string,
  prefs: UserPreferences,
): Document<Question> {
  return {
    ...question,
    author:
      question.authorId === authorId ? { ...(question.author ?? {}), prefs } : question.author,
    answersRel: (question.answersRel ?? []).map((answer) =>
      answer.authorId === authorId
        ? {
            ...answer,
            author: { ...(answer.author ?? {}), prefs },
          }
        : answer,
    ),
  };
}
