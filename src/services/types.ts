import { Models } from 'node-appwrite';
import { UserPreferences } from '@/store/Auth';

export type Document<T> = Models.Document & T & { author: Author };
export type DocumentList<T> = Models.DocumentList<Document<T>>;
export type Author = Models.User<UserPreferences>;

type Rel = {
  $id: string;
  $databaseId: string;
  $collectionId: string;
};
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
  answersRel: Rel[];
  // votesRel: Rel[];
};
export type Question = QuestionSummary & {
  content: string;
  attachmentId: string;
  commentsRel: Rel[];
};
export type Answer = {
  content: string;
  authorId: string;
  questionId?: string;
  questionRel: Rel;
  commentsRel: Rel[];
  // votesRel: Rel[];
};
export type Comment = {
  content: string;
  authorId: string;
  type?: 'question' | 'answer';
  typeId?: string;
  questionRel: Rel;
  answerRel: Rel;
};
export type Vote = {
  direction: 'down' | 'up';
  authorId: string;
  type?: 'question' | 'answer';
  typeId?: string;
  // TODO relations
  // questionRel: Rel;
  // answerRel: Rel;
};
