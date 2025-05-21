export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  return (
    <h1>
      Question Page {id}/{slug}
    </h1>
  );
}
