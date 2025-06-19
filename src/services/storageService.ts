import { QUESTION_ATTACHMENT_BUCKET_ID } from '@/models/name';
import { ID, storage } from '@/models/client/config';
import { Models } from 'appwrite';

export function getAttachment(attachmentId: string) {
  return storage.getFileView(QUESTION_ATTACHMENT_BUCKET_ID, attachmentId);
}

export async function createAttachment(file: File): Promise<Models.File> {
  return storage.createFile(QUESTION_ATTACHMENT_BUCKET_ID, ID.unique(), file);
}

export async function deleteAttachment(fileId: string): Promise<object> {
  return storage.deleteFile(QUESTION_ATTACHMENT_BUCKET_ID, fileId);
}
