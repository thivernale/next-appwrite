import { databases } from '@/models/server/config';
import { Permission, RelationMutate, RelationshipType, Role } from 'node-appwrite';
import { ANSWER_COLLECTION_ID, QUESTION_COLLECTION_ID, VOTE_COLLECTION_ID } from '@/models/name';

export async function createVoteCollection(dbId: string) {
  console.log('Creating "vote" collection');

  return databases
    .createCollection(dbId, VOTE_COLLECTION_ID, VOTE_COLLECTION_ID, [
      Permission.read(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
    .then((collection) => {
      return Promise.all([
        databases.createStringAttribute(dbId, collection.$id, 'authorId', 255, true),
        databases.createEnumAttribute(dbId, collection.$id, 'direction', ['down', 'up'], true),
        databases.createEnumAttribute(dbId, collection.$id, 'type', ['question', 'answer'], true),
        databases.createStringAttribute(dbId, collection.$id, 'typeId', 50, false),
        databases.createRelationshipAttribute(
          dbId,
          QUESTION_COLLECTION_ID,
          VOTE_COLLECTION_ID,
          RelationshipType.OneToMany,
          true,
          'questionRel',
          'votesRel',
          RelationMutate.Restrict,
        ),
        databases.createRelationshipAttribute(
          dbId,
          ANSWER_COLLECTION_ID,
          VOTE_COLLECTION_ID,
          RelationshipType.OneToMany,
          true,
          'answerRel',
          'votesRel',
          RelationMutate.Restrict,
        ),
      ]).then(() => collection);
    })
    .catch((reason) => {
      console.log(reason);
    });
}
