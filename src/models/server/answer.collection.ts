import { databases, delay } from '@/models/server/config';
import { IndexType, Permission, RelationMutate, RelationshipType, Role } from 'node-appwrite';
import { ANSWER_COLLECTION_ID, QUESTION_COLLECTION_ID } from '@/models/name';

export async function createAnswerCollection(dbId: string) {
  console.log('Creating "answer" collection');

  return databases
    .createCollection(dbId, ANSWER_COLLECTION_ID, ANSWER_COLLECTION_ID, [
      Permission.read(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
    .then((collection) => {
      return Promise.all([
        databases.createStringAttribute(dbId, collection.$id, 'questionId', 50, false),
        databases.createStringAttribute(dbId, collection.$id, 'content', Math.pow(2, 16), true),
        databases.createStringAttribute(dbId, collection.$id, 'authorId', 255, true),
        databases.createRelationshipAttribute(
          dbId,
          QUESTION_COLLECTION_ID,
          ANSWER_COLLECTION_ID,
          RelationshipType.OneToMany,
          true,
          'answersRel',
          'questionRel',
          RelationMutate.Restrict,
        ),
      ]).then(() => collection);
    })
    .then((collection) => {
      // add delay to be able to create index right after attributes
      return delay(1000).then(() =>
        databases
          .createIndex(
            dbId,
            collection.$id,
            'index_answer_content',
            IndexType.Fulltext,
            ['content'],
            ['ASC'],
          )
          .then(() => collection),
      );
    })
    .catch((reason) => {
      console.log(reason);
    });
}
