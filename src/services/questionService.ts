'use server';

import { Document, DocumentList, Question, QuestionSummary, SearchParams } from '@/services/types';
import { ID, Models, Query } from 'appwrite';
import { databases, users } from '@/models/server/config';
import { DATABASE_ID, QUESTION_COLLECTION_ID } from '@/models/name';
import { UserPreferences } from '@/store/Auth';
import { getUser } from '@/services/userService';

export async function searchQuestions({
  page = 1,
  limit = 25,
  sort = '$createdAt',
  sortAscending = false,
  search = { search: '' },
}: SearchParams): Promise<DocumentList<QuestionSummary>> {
  const queries = [
    Query[sortAscending ? 'orderAsc' : 'orderDesc'](sort),
    Query.limit(limit),
    Query.offset((+page - 1) * limit),
    Query.select(['$id', '$createdAt', 'title', 'authorId', 'tags', 'answersRel.$id']),
  ];
  if (search?.search) {
    queries.push(
      Query.or([Query.search('title', search.search), Query.search('content', search.search)]),
    );
  }
  if (search?.tag) {
    queries.push(Query.equal('tags', search.tag));
  }
  if (search?.authorId) {
    queries.push(Query.equal('authorId', search.authorId));
  }

  const questions = await databases.listDocuments<Document<QuestionSummary>>(
    DATABASE_ID,
    QUESTION_COLLECTION_ID,
    queries,
  );

  await getAuthors(questions.documents);

  return questions;
}

async function getAuthors(documents: Models.Document[], authorIdProp: string = 'authorId') {
  if (documents && documents.length > 0) {
    const authorIds = [...new Set(documents.map((d) => d[authorIdProp]))];
    const authors = await users.list<UserPreferences>([Query.equal('$id', authorIds)]);

    documents.forEach((document) => {
      document.author = authors.users.find((user) => user.$id === document[authorIdProp]);
    });
  }
}

export async function getQuestion(id: string): Promise<Document<Question>> {
  return databases
    .getDocument<Document<Question>>(DATABASE_ID, QUESTION_COLLECTION_ID, id)
    .then(async (question) => {
      const user = await getUser<UserPreferences>(question.authorId);

      const authorPromises: Promise<void>[] = [
        getAuthors(question.answersRel || []),
        getAuthors(question.commentsRel || []),
        ...(question.answersRel || []).map((a) => getAuthors(a.commentsRel)),
      ];
      await Promise.all(authorPromises);

      return {
        ...question,
        author: user,
      };
    });
}

export async function createQuestion(data: Question): Promise<Document<Question>> {
  return await databases.createDocument(DATABASE_ID, QUESTION_COLLECTION_ID, ID.unique(), data);
}

export async function updateQuestion(id: string, data: Question): Promise<Document<Question>> {
  return await databases.updateDocument(DATABASE_ID, QUESTION_COLLECTION_ID, id, data);
}

export async function deleteQuestion(documentId: string): Promise<object> {
  return databases.deleteDocument(DATABASE_ID, QUESTION_COLLECTION_ID, documentId);
}
