'use server';

import { Answer, Document, DocumentList, SearchParams } from '@/services/types';
import { databases, ID } from '@/models/server/config';
import { ANSWER_COLLECTION_ID, DATABASE_ID } from '@/models/name';
import { Query } from 'appwrite';

export async function createAnswer(data: Answer): Promise<Document<Answer>> {
  return databases.createDocument<Document<Answer>>(
    DATABASE_ID,
    ANSWER_COLLECTION_ID,
    ID.unique(),
    data,
  );
}

export async function deleteAnswer(documentId: string): Promise<object> {
  return databases.deleteDocument(DATABASE_ID, ANSWER_COLLECTION_ID, documentId);
}

export async function searchAnswers({
  page = 1,
  limit = 25,
  sort = '$createdAt',
  sortAscending = false,
  search = { search: '' },
}: SearchParams): Promise<DocumentList<Answer>> {
  const queries = [
    Query[sortAscending ? 'orderAsc' : 'orderDesc'](sort),
    Query.limit(limit),
    Query.offset((+page - 1) * limit),
    //Query.select(['$id', '$createdAt', 'authorId', 'content', 'questionId', 'questionRel.$id']),
  ];
  if (search?.search) {
    queries.push(Query.search('content', search.search));
  }
  if (search?.authorId) {
    queries.push(Query.equal('authorId', search.authorId));
  }

  return await databases.listDocuments<Document<Answer>>(
    DATABASE_ID,
    ANSWER_COLLECTION_ID,
    queries,
  );
}
