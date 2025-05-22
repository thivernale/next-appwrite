import { databases, delay } from '@/models/server/config';
import { IndexType, Permission, Role } from 'node-appwrite';
import { QUESTION_COLLECTION_ID } from '@/models/name';

export async function createQuestionCollection(dbId: string) {
  console.log('Creating "question" collection');

  return databases
    .createCollection(dbId, QUESTION_COLLECTION_ID, QUESTION_COLLECTION_ID, [
      Permission.read(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
    .then((collection) => {
      return Promise.all([
        databases.createStringAttribute(dbId, collection.$id, 'title', 255, true),
        databases.createStringAttribute(dbId, collection.$id, 'content', Math.pow(2, 16), true),
        databases.createStringAttribute(dbId, collection.$id, 'authorId', 255, true),
        databases.createStringAttribute(dbId, collection.$id, 'tags', 50, true, undefined, true),
        databases.createStringAttribute(dbId, collection.$id, 'attachmentId', 255, false),
      ]).then(() => collection);
    })
    .then((collection) => {
      // add delay to be able to create index right after attributes
      return delay(1000)
        .then(() =>
          Promise.all([
            databases.createIndex(
              dbId,
              collection.$id,
              'index_question_title',
              IndexType.Fulltext,
              ['title'],
              ['ASC'],
            ),
            databases.createIndex(
              dbId,
              collection.$id,
              'index_question_content',
              IndexType.Fulltext,
              ['content'],
              ['ASC'],
            ),
          ]),
        )
        .then(() => collection);
    })
    .catch((reason) => {
      console.log(reason);
    });
}
