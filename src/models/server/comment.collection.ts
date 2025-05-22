import { databases, delay } from '@/models/server/config';
import { IndexType, Permission, RelationMutate, RelationshipType, Role } from 'node-appwrite';
import { ANSWER_COLLECTION_ID, COMMENT_COLLECTION_ID, QUESTION_COLLECTION_ID } from '@/models/name';

export async function createCommentCollection(dbId: string) {
  console.log('Creating "comment" collection');

  return databases
    .createCollection(dbId, COMMENT_COLLECTION_ID, COMMENT_COLLECTION_ID, [
      Permission.read(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
    .then((collection) => {
      return Promise.all([
        databases.createStringAttribute(dbId, collection.$id, 'content', Math.pow(2, 16), true),
        databases.createStringAttribute(dbId, collection.$id, 'authorId', 255, true),
        databases.createEnumAttribute(dbId, collection.$id, 'type', ['question', 'answer'], true),
        databases.createStringAttribute(dbId, collection.$id, 'typeId', 50, false),
        databases.createRelationshipAttribute(
          dbId,
          QUESTION_COLLECTION_ID,
          COMMENT_COLLECTION_ID,
          RelationshipType.OneToMany,
          true,
          'questionRel',
          'commentsRel',
          RelationMutate.Restrict,
        ),
        databases.createRelationshipAttribute(
          dbId,
          ANSWER_COLLECTION_ID,
          COMMENT_COLLECTION_ID,
          RelationshipType.OneToMany,
          true,
          'answerRel',
          'commentsRel',
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
            'index_comment_content',
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
