'use server';

import { databases } from '@/models/server/config';
import { DATABASE_ID, VOTE_COLLECTION_ID } from '@/models/name';
import { ID, Query } from 'appwrite';
import { Document, DocumentList, SearchParams, Vote } from '@/services/types';

export async function deleteVote(documentId: string): Promise<object> {
  return databases.deleteDocument(DATABASE_ID, VOTE_COLLECTION_ID, documentId);
}

export async function createVote(data: Vote): Promise<Document<Vote>> {
  return databases.createDocument(DATABASE_ID, VOTE_COLLECTION_ID, ID.unique(), data);
}

export async function searchVotes({
  page = 1,
  limit = 25,
  sort = '$createdAt',
  sortAscending = false,
  search = { search: '' },
}: SearchParams): Promise<DocumentList<Vote>> {
  const queries = [
    Query[sortAscending ? 'orderAsc' : 'orderDesc'](sort),
    Query.limit(limit),
    Query.offset((+page - 1) * limit),
    //Query.select(['$id', '$createdAt', 'authorId', 'questionId', 'questionRel.$id']),
  ];
  if (search?.direction) {
    queries.push(Query.equal('direction', search.direction));
  }
  if (search?.authorId) {
    queries.push(Query.equal('authorId', search.authorId));
  }

  return await databases.listDocuments<Document<Vote>>(DATABASE_ID, VOTE_COLLECTION_ID, queries);
}
