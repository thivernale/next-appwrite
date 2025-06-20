'use server';

import { Answer, Document } from '@/services/types';
import { databases, ID } from '@/models/server/config';
import { ANSWER_COLLECTION_ID, DATABASE_ID } from '@/models/name';

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
