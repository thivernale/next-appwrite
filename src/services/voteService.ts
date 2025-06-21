'use server';

import { databases } from '@/models/server/config';
import { DATABASE_ID, VOTE_COLLECTION_ID } from '@/models/name';
import { ID } from 'appwrite';
import { Document, Vote } from '@/services/types';

export async function deleteVote(documentId: string): Promise<object> {
  return databases.deleteDocument(DATABASE_ID, VOTE_COLLECTION_ID, documentId);
}

export async function createVote(data: Vote): Promise<Document<Vote>> {
  return databases.createDocument(DATABASE_ID, VOTE_COLLECTION_ID, ID.unique(), data);
}
