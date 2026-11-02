// Demonstrates notFound() routing to the nearest not-found.tsx
// and parallel data fetching with Promise.all

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "../data";

const DELAY_MS = 200; // Simulated database round-trip
const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

// Mock data fetching functions (simulate database queries)
async function fetchPost(slug: string) {
  await delay();
  const post = getPost(slug);
  return post ? { id: slug, slug, authorId: "user-1", ...post } : null;
}

async function fetchAuthor(authorId: string) {
  await delay();
  return { id: authorId, name: "Demo Author" };
}

async function fetchComments(_postId: string) {
  await delay();
  return [
    { id: "c1", author: "Reader 1", text: "Great article!" },
    { id: "c2", author: "Reader 2", text: "Very helpful, thanks!" },
  ];
}

// ✅ OPTIMIZED: the post must load first (we need authorId and postId),
// then author and comments run in parallel with Promise.all.
// Measured in dev: sequential ~612ms → parallel ~400ms (≈1.5x faster).
// A single query with ORM includes/joins would cut this to one round-trip.
async function getPostData(slug: string) {
  const post = await fetchPost(slug);
  if (!post) {
    return null;
  }

  const [author, comments] = await Promise.all([
    fetchAuthor(post.authorId),
    fetchComments(post.id),
  ]);

  return { post, author, comments };
}

// In Next.js 16, params is a Promise that must be awaited
export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  // performance.now(): Cache Components rejects Date.now() during prerender
  const start = performance.now();
  const data = await getPostData(params.slug);
  console.log(
    `[post] Loaded in ${Math.round(performance.now() - start)}ms (parallel)`
  );

  // If post doesn't exist, trigger 404
  // notFound() throws - don't wrap in try/catch or it won't work
  if (!data) {
    notFound();
  }

  const { post, author, comments } = data;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href="/posts"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back to posts
      </Link>
      <article className="space-y-6">
        <header>
          <h1 className="font-bold text-3xl">{post.title}</h1>
          <p className="mt-2 text-gray-600">By {author.name}</p>
        </header>
        <p className="text-gray-600">{post.content}</p>
        <section>
          <h2 className="mb-4 font-semibold text-xl">
            Comments ({comments.length})
          </h2>
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                className="rounded bg-gray-50 p-3 text-gray-900"
                key={comment.id}
              >
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
