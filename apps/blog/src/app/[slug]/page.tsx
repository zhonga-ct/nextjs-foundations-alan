import { fetchPostBySlug } from '@repo/api/blog';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

// Dedupe within a request so generateMetadata and the page see the same post
// (the mock generates a fresh random post for unknown slugs on every call)
const getPost = cache(fetchPostBySlug);

// ✅ Direct data access - no relative fetch('/api/...') on the server
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.title, // Layout template adds " | VAF Blog" suffix
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: `/${slug}`, // Resolves against metadataBase to .../blog/<slug>
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-6">
      <Link className="text-blue-600 text-sm hover:underline" href="/">
        ← Back to posts
      </Link>

      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl">{post.title}</h1>
          <p className="text-gray-500 text-sm">
            {post.category} · {post.readingTime} min read ·{' '}
            {post.publishedAt.toLocaleDateString()}
          </p>
          <p className="text-gray-500 text-sm">By {post.author.name}</p>
        </header>

        <div className="prose max-w-none">
          {post.content.split('\n\n').map((paragraph) => (
            <p className="mb-4" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="flex flex-wrap gap-2 border-t pt-4">
          {post.tags.map((tag) => (
            <span
              className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-sm"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </footer>
      </article>
    </main>
  );
}
