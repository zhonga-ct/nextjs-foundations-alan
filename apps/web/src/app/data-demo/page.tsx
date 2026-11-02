import { connection } from "next/server";
import { Suspense } from "react";
import { fetchPosts, fetchStats, fetchUser } from "./data";

// Parallel fetch with timing measurement
async function fetchParallel() {
  // Measure per request (Cache Components: timing needs request time)
  await connection();
  const startTime = performance.now();

  // Promise.all runs all fetches simultaneously
  // Total time = max(200, 300, 250) = ~300ms instead of 750ms sequential
  const [user, posts, stats] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);

  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);

  return { user, posts, stats, duration };
}

export default function DataDemoPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-3xl">
        Data Fetching Without Waterfalls
      </h1>

      <Suspense fallback={<p className="text-gray-500">Fetching data…</p>}>
        <DataResults />
      </Suspense>
    </main>
  );
}

async function DataResults() {
  const { user, posts, stats, duration } = await fetchParallel();

  return (
    <>
      {/* Performance result banner */}
      <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
        <h2 className="font-semibold text-green-800">Performance Result</h2>
        <p className="text-green-700">
          Parallel fetch completed in{" "}
          <span className="font-bold font-mono">{duration}ms</span>
        </p>
        <p className="mt-2 text-green-600 text-sm">
          Sequential would take ~750ms (200 + 300 + 250ms). Parallel takes
          ~300ms (max of all three).
        </p>
      </div>

      <div className="space-y-6">
        {/* User data */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">User (200ms fetch)</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>

        {/* Posts data */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Posts (300ms fetch)</h2>
          <ul className="list-inside list-disc">
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>

        {/* Stats data */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Stats (250ms fetch)</h2>
          <p>Views: {stats.views.toLocaleString()}</p>
          <p>Likes: {stats.likes.toLocaleString()}</p>
        </div>
      </div>

      {/* Code comparison */}
      <div className="mt-8 rounded bg-gray-100 p-4 text-gray-900">
        <h3 className="mb-2 font-semibold">Key Takeaway</h3>
        <pre className="overflow-x-auto font-mono text-sm">
          {`// ❌ Sequential (750ms total)
const user = await fetchUser();    // 200ms
const posts = await fetchPosts();  // 300ms
const stats = await fetchStats();  // 250ms

// ✅ Parallel (300ms total)
const [user, posts, stats] = await Promise.all([
  fetchUser(),    // All run
  fetchPosts(),   // simultaneously
  fetchStats(),   // max(200,300,250) = 300ms
]);`}
        </pre>
      </div>
    </>
  );
}
