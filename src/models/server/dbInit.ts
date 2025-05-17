import { databases } from '@/models/server/config';
import {
  ANSWER_COLLECTION_ID,
  COMMENT_COLLECTION_ID,
  DATABASE_ID,
  QUESTION_COLLECTION_ID,
  VOTE_COLLECTION_ID,
} from '@/models/name';
import { ID, Models, Query } from 'node-appwrite';
import { createQuestionCollection } from '@/models/server/question.collection';
import { createAnswerCollection } from '@/models/server/answer.collection';
import { createCommentCollection } from '@/models/server/comment.collection';
import { createVoteCollection } from '@/models/server/vote.collection';
import Collection = Models.Collection;

export async function getOrCreateDatabase() {
  databases.list(
    [Query.equal('name', DATABASE_ID)],
  )
    .then(databaseList => {
      if (databaseList.total > 0) {
        console.log('Database found');
        return databaseList.databases[0];
      }
      throw new Error('Database not found, will attempt to create it');
    })
    .catch(reason => {
      console.log(reason.message);

      return databases.create(
        ID.unique(),
        DATABASE_ID,
      );
    })
    .then(db => {
      databases.listCollections(db.$id).then(collectionList => {
        const createCollectionMap = new Map<string, (dbId: string) => Promise<Collection | void>>([
          [QUESTION_COLLECTION_ID, createQuestionCollection],
          [ANSWER_COLLECTION_ID, createAnswerCollection],
          [COMMENT_COLLECTION_ID, createCommentCollection],
          [VOTE_COLLECTION_ID, createVoteCollection],
        ]);
        const createFunctions: Promise<Collection | void>[] = [];

        createCollectionMap.forEach((createFunction, collectionName) => {
          if (!collectionList.collections.find(collection => collection.name === collectionName)) {
            createFunctions.push(createFunction(db.$id));
          }
        });

        if (createFunctions.length > 0) {
          console.log('Creating collections...');

          Promise.all(createFunctions)
            .then(collections => {
              collections.forEach(collection => {
                if (collection != null) {
                  console.log(`Collection "${collection.name}" created`);
                }
              });
            });
        }
      });
    })
    .catch(reason => {
      console.log(reason);
    });
}
