import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  return {
    title: params.page,
    description: `Page content for ${params.page}`,
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{params.page}</h1>
      <p className="text-gray-600">Page content coming soon.</p>
    </>
  );
}
