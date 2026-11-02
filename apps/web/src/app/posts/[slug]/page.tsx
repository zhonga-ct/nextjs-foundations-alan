// Demonstrates notFound() routing to the nearest not-found.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "../data";

// In Next.js 16, params is a Promise that must be awaited
export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = getPost(params.slug);

  // If post doesn't exist, trigger 404
  // notFound() throws - don't wrap in try/catch or it won't work
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href="/posts"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back to posts
      </Link>
      <h1 className="mb-4 font-bold text-3xl">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
    </main>
  );
}
