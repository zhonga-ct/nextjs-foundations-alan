import { redirect } from "next/navigation";
import { fetchPosts, fetchStats, fetchUser } from "@/app/data-demo/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: PageProps) {
  // Include params in Promise.all for optimal performance
  const [{ id }, user, posts, stats] = await Promise.all([
    params, // Await params alongside data fetches
    fetchUser(), // These run in parallel with params resolution
    fetchPosts(),
    fetchStats(),
  ]);

  // Now use id for any dependent fetches
  // (Better: restructure so all independent fetches are in Promise.all)

  // Simulated lookup: only numeric ids exist in the mock data
  const userExists = /^\d+$/.test(id);

  // Redirect to login if user not found (auth scenario)
  if (!userExists) {
    redirect("/login");
  }

  // Alternative: show 404 for missing resources
  // if (!userExists) {
  //   notFound();
  // }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">User {id}</h1>
      <p>{user.name}</p>
      <p className="mt-2 text-gray-600 text-sm">
        {posts.length} posts · {stats.views.toLocaleString()} views ·{" "}
        {stats.likes.toLocaleString()} likes
      </p>
    </main>
  );
}
