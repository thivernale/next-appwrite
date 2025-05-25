import { Document, DocumentList, Question, QuestionSummary, SearchParams } from '@/services/types';
import { ID, Models, Query } from 'appwrite';
import { databases, users } from '@/models/server/config';
import { DATABASE_ID, QUESTION_COLLECTION_ID } from '@/models/name';
import { UserPreferences } from '@/store/Auth';

export async function searchQuestions({
  page = 1,
  limit = 25,
  sort = '$createdAt',
  sortAscending = false,
  search = { search: '' },
}: SearchParams): Promise<DocumentList<QuestionSummary>> {
  const queries = [
    Query[sortAscending ? 'orderAsc' : 'orderDesc'](sort),
    Query.limit(limit),
    Query.offset((+page - 1) * limit),
    Query.select(['$id', '$createdAt', 'title', 'authorId', 'tags', 'answersRel.$id']),
  ];
  if (search?.search !== '') {
    queries.push(
      Query.or([Query.search('title', search.search), Query.search('content', search.search)]),
    );
  }
  if (search?.tag !== '') {
    queries.push(Query.equal('tags', search.tag));
  }

  const questions = await databases.listDocuments<Models.Document & QuestionSummary>(
    DATABASE_ID,
    QUESTION_COLLECTION_ID,
    queries,
  );

  await getAuthors(questions.documents);

  return questions as DocumentList<QuestionSummary>;
}

async function getAuthors(documents: Models.Document[], authorIdProp: string = 'authorId') {
  if (documents && documents.length > 0) {
    const authorIds = [...new Set(documents.map((d) => d[authorIdProp]))];
    const authors = await users.list<UserPreferences>([Query.equal('$id', authorIds)]);

    documents.forEach((document) => {
      document.author = authors.users.find((user) => user.$id === document[authorIdProp]);
    });
  }
}

export async function getQuestion(id: string): Promise<Document<Question>> {
  return databases
    .getDocument<Models.Document & Question>(DATABASE_ID, QUESTION_COLLECTION_ID, id)
    .then(async (question) => {
      const user = await users.get<UserPreferences>(question.authorId);

      await getAuthors(question.answersRel);
      question.answersRel.forEach(async (a) => {
        await getAuthors(a.commentsRel);
      });
      await getAuthors(question.commentsRel);

      return {
        ...question,
        author: user,
      };
    });
}

export async function createQuestion(data: Question) {
  return await databases.createDocument(DATABASE_ID, QUESTION_COLLECTION_ID, ID.unique(), data);
}

export async function updateQuestion(id: string, data: Question) {
  return await databases.updateDocument(DATABASE_ID, QUESTION_COLLECTION_ID, id, data);
}
