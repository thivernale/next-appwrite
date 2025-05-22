import { storage } from '@/models/server/config';
import { Models, Permission, Role } from 'node-appwrite';
import { QUESTION_ATTACHMENT_BUCKET_ID } from '@/models/name';

export async function getOrCreateStorageBucket(): Promise<Models.Bucket> {
  return storage.getBucket(QUESTION_ATTACHMENT_BUCKET_ID).catch((reason) => {
    console.error(reason.message);
    console.log('Attempting to create storage bucket.');

    return storage
      .createBucket(
        QUESTION_ATTACHMENT_BUCKET_ID,
        QUESTION_ATTACHMENT_BUCKET_ID,
        [
          Permission.read(Role.any()),
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false,
        true,
        5_000_000, // 5M
        ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      )
      .then((bucket) => {
        console.log('Storage bucket created');
        return bucket;
      })
      .catch((reason) => {
        console.error(reason.message);
        throw new Error(reason);
      });
  });
}
