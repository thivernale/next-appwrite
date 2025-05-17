import { storage } from '@/models/server/config';
import { ID, Permission, Query, Role } from 'node-appwrite';
import { QUESTION_ATTACHMENT_BUCKET_ID } from '@/models/name';

export async function getOrCreateStorageBucket() {
  storage.listBuckets(
    [Query.equal('name', QUESTION_ATTACHMENT_BUCKET_ID), Query.equal('enabled', true)],
  )
    .then(bucketList => {
      if (bucketList.total > 0) {
        console.log('Storage bucket found');
        return bucketList.buckets[0];
      }
      throw new Error('Storage bucket not found, will attempt to create it');
    })
    .catch(reason => {
      console.log(reason.message);

      return storage.createBucket(
        ID.unique(),
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
        undefined,
        ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      ).then(bucket => {
        console.log('Storage bucket created');
        return bucket;
      })
        .catch(reason => {
          console.log(reason.message);
        });
    });
}
