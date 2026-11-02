// Simulated posts database (in-memory, resets when the server restarts)

type Post = { title: string; content: string };

// Kept on globalThis so the Server Action and the page share one store
// (the bundler can load this module more than once on the server)
const globalForPosts = globalThis as typeof globalThis & {
  __demoPosts?: Map<string, Post>;
};

globalForPosts.__demoPosts ??= new Map<string, Post>([
  [
    "hello-world",
    {
      title: "Hello World",
      content: "This is the first post. Welcome to the blog!",
    },
  ],
  [
    "nextjs-tips",
    {
      title: "Next.js Tips",
      content: "Here are some tips for building with Next.js...",
    },
  ],
]);

const posts = globalForPosts.__demoPosts;

export function getPost(slug: string): Post | undefined {
  return posts.get(slug);
}

export function createPostRecord(post: Post): { slug: string } & Post {
  const base =
    post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "post";

  // Avoid overwriting an existing post with the same title
  let slug = base;
  for (let i = 2; posts.has(slug); i++) {
    slug = `${base}-${i}`;
  }

  posts.set(slug, post);
  return { slug, ...post };
}
