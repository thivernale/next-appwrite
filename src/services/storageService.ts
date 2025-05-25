import { QUESTION_ATTACHMENT_BUCKET_ID } from '@/models/name';
import { storage } from '@/models/client/config';

export function getAttachment(attachmentId: string) {
  return storage.getFileView(QUESTION_ATTACHMENT_BUCKET_ID, attachmentId);
}
