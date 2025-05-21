export default async function QuestionEditPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  return (
    <h1>
      Question Edit Page {id}/{slug}
    </h1>
  );
}
