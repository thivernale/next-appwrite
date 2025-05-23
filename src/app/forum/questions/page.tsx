import { databases } from '@/models/client/config';
import { DATABASE_ID, QUESTION_COLLECTION_ID } from '@/models/name';
import { Models, Query } from 'appwrite';
import Link from 'next/link';
import { Search } from '@/app/forum/questions/Search';

/*gql.query({
  query: `query GetAccountAndLocale {
  accountGet {
      _id
      email
  }
  localeGet {
      ip
  }
}`,
  variables: {},
});*/

type Question = {
  authorId: string;
  title: string;
  tags: string[];
};

async function searchQuestions(page: number = 1, search: string = '', tag = '') {
  const queries = [
    Query.orderDesc('$createdAt'),
    Query.limit(25),
    Query.offset((+page - 1) * 25),
    Query.select([
      '$id',
      '$createdAt',
      '$updatedAt',
      'title',
      'authorId',
      'tags',
      'answersRel.$id',
    ]),
  ];
  if (search !== '') {
    queries.push(Query.or([Query.search('title', search), Query.search('content', search)]));
  }
  if (tag !== '') {
    queries.push(Query.equal('tags', tag));
  }

  const questions = await databases.listDocuments<Models.Document & Question>(
    DATABASE_ID,
    QUESTION_COLLECTION_ID,
    queries,
  );

  console.log(questions);
  return questions;
}

export default async function QuestionListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) {
  const { page = '1', search = '', tag = '' } = await searchParams;

  const questions = await searchQuestions(+page || 1, search, tag);

  return (
    <div className="mx-autoo container px-4 pt-36 pb-20">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Question List Page</h1>
        <Link
          href="questions/ask"
          className="bg-accent hover:bg-accent/30 shrink-0 rounded-md px-4 py-2 font-bold"
        >
          <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap lg:text-lg">
            Ask a question
          </span>
        </Link>
      </div>
      <div className="mb-4">
        <Search />
      </div>
      <div className="mb-4">{questions.total} questions</div>
      <div className="mb-4 max-w-3xl space-y-6">
        {questions.documents.map((question) => (
          <div key={question.$id}>
            <Link href={`questions/${question.$id}/${question.title.replace(' ', '-')}}`}>
              {question.title}
            </Link>
          </div>
        ))}
      </div>
      {'TODO Pagination goes here'}
    </div>
  );
}
