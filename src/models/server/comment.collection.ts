import { databases, delay } from '@/models/server/config';
import { ID, IndexType, Permission, Role } from 'node-appwrite';
import { COMMENT_COLLECTION_ID } from '@/models/name';

export async function createCommentCollection(dbId: string) {
  console.log('Creating "comment" collection');

  return databases.createCollection(
    dbId,
    ID.unique(),
    COMMENT_COLLECTION_ID,
    [
      Permission.read(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ],
  ).then(collection => {
    return Promise.all([
      databases.createStringAttribute(
        dbId,
        collection.$id,
        'content',
        Math.pow(2, 16),
        true,
      ),
      databases.createStringAttribute(
        dbId,
        collection.$id,
        'authorId',
        255,
        true,
      ),
      databases.createEnumAttribute(
        dbId,
        collection.$id,
        'type',
        ['question', 'answer'],
        true,
      ),
      databases.createStringAttribute(
        dbId,
        collection.$id,
        'typeId',
        50,
        false,
      ),
    ]).then(() => collection);

  }).then(collection => {
    // add delay to be able to create index right after attributes
    return delay(1000).then(() =>
      (databases.createIndex(
        dbId,
        collection.$id,
        'index_comment_content',
        IndexType.Fulltext,
        ['content'],
        ['ASC'],
      ).then(() => collection)),
    );
  }).catch(reason => {
    console.log(reason);
  });
}
