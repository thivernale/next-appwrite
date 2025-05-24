import { DocumentList, QuestionSummary, SearchParams } from '@/services/types';
import { Models, Query } from 'appwrite';
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

  if (questions.documents.length > 0) {
    const authorIds = [...new Set(questions.documents.map((d) => d.authorId))];
    const authors = await users.list<UserPreferences>([Query.equal('$id', authorIds)]);

    questions.documents.forEach((document) => {
      document.author = authors.users.find((user) => user.$id === document.authorId);
    });
  }

  return questions as DocumentList<QuestionSummary>;
}
