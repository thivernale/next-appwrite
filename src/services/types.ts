import { Models } from 'node-appwrite';
import { UserPreferences } from '@/store/Auth';

export type Document<T> = Models.Document & T & { author: Author };
export type DocumentList<T> = Models.DocumentList<Document<T>>;
export type Author = Models.User<UserPreferences>;

export type SearchParams = {
  page?: number;
  limit?: number;
  sort?: string;
  sortAscending?: boolean;
  search?: Record<string, string>;
};
export type QuestionSummary = {
  title: string;
  authorId: string;
  tags: string[];
  answersRel: Document<Answer>[];
  // votesRel: Rel[];
};
export type Question = QuestionSummary & {
  content: string;
  attachmentId: string;
  commentsRel: Document<Comment>[];
  // votesRel: Document<Vote>[];
};
export type Answer = {
  content: string;
  authorId: string;
  questionId?: string;
  questionRel: Document<Question>;
  commentsRel: Document<Comment>[];
  // votesRel: Document<Vote>[];
};
export type Comment = {
  content: string;
  authorId: string;
  type?: 'question' | 'answer';
  typeId?: string;
  questionRel: Document<Question>;
  answerRel: Document<Answer>;
};
export type Vote = {
  direction: 'down' | 'up';
  authorId: string;
  type?: 'question' | 'answer';
  typeId?: string;
  // TODO relations
  // questionRel: Document<Question>;
  // answerRel: Document<Answer>;
};
