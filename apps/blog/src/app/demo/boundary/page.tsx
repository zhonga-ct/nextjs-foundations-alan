// No 'use client' - this is a Server Component by default
// Posts are fetched here on the server and passed to client wrappers as children

import { fetchPosts } from '@repo/api/blog'

import { Counter } from '@/components/counter'
import { ExpandableWrapper } from '@/components/expandable-wrapper'

export default async function BoundaryDemoPage() {
  // Server-side data fetching (no JS shipped for this)
  const posts = await fetchPosts(3)

  return (
    <main className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Server/Client Boundary Demo</h1>
        <p className="mt-2 text-muted-foreground">
          This page is a Server Component. Only the counter and the expand/collapse toggle are client-side.
        </p>
      </div>

      {/* Client wrapper with server-rendered children */}
      <ExpandableWrapper title="Latest Posts">
        {/* These cards are rendered on the server - zero JS */}
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <h3 className="font-semibold">{post.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {post.category} · {post.readingTime} min read
              </p>
            </article>
          ))}
        </div>
      </ExpandableWrapper>

      {/* Client Component - interactive widget */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Client Component (Interactive)</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Only this counter component ships JavaScript to the browser.
        </p>
        <Counter initialCount={0} />
      </section>

      {/* Decision documentation */}
      <section className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold text-lg">Decision Rationale</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>
            <strong>Page (Server):</strong> Fetches posts, renders static content
          </li>
          <li>
            <strong>ExpandableWrapper (Client):</strong> Uses useState for expand/collapse toggle
          </li>
          <li>
            <strong>Counter (Client):</strong> Uses useState hook, handles onClick events
          </li>
        </ul>
      </section>
    </main>
  )
}
