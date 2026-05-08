'use server';

import { databases } from '@/models/server/config';
import { COMMENT_COLLECTION_ID, DATABASE_ID } from '@/models/name';
import { ID } from 'appwrite';
import { Comment, Document } from '@/services/types';
import { Permission, Role } from 'node-appwrite';

export async function deleteComment(documentId: string): Promise<object> {
  return databases.deleteDocument(DATABASE_ID, COMMENT_COLLECTION_ID, documentId);
}

export async function createComment(data: Comment): Promise<Document<Comment>> {
  return databases.createDocument(DATABASE_ID, COMMENT_COLLECTION_ID, ID.unique(), data, [
    Permission.read(Role.any()),
    Permission.delete(Role.user(data.authorId)),
  ]);
}
