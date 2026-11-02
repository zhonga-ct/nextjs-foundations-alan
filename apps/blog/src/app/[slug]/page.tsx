import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

// Mock data fetcher
async function getPost(slug: string) {
  const posts: Record<string, { title: string; content: string }> = {
    'hello-world': { title: 'Hello World', content: 'Welcome to our blog!' },
    'nextjs-routing': {
      title: 'Next.js Routing',
      content: 'Learn about App Router.',
    },
  };
  return posts[slug] || null;
}

export default async function BlogPostPage({ params }: Props) {
  // params = identity: which post to show
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 font-bold text-3xl">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
    </article>
  );
}
