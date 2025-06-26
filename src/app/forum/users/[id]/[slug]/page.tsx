export default async function AuthorSummaryPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto px-4 pt-36 pb-20">
      <div className="flex">
        <div className="w-full">
          <h1 className="mb-1 text-3xl font-bold">{id}</h1>
          {/*<div className="flex justify-start gap-4">
            <span title={author.$createdAt}>
              asked {convertDateToRelativeTime(new Date(author.$createdAt))}
            </span>
            <span>{author.votesRel?.length ?? 0} votes</span>
            <span>{author.answersRel?.length ?? 0} answers</span>
          </div>*/}
        </div>
      </div>

      <hr className="border-secondary my-4" />
    </div>
  );
}
