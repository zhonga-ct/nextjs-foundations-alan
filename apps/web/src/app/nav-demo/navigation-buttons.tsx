"use client";

// Client component for programmatic navigation with useRouter
// Must be a Client Component because useRouter uses React hooks

import { useRouter } from "next/navigation";

export function NavigationButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-4">
      {/* push: adds to history stack */}
      <button
        type="button"
        onClick={() => router.push("/nav-demo/page-a")}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        router.push()
      </button>

      {/* back: navigate to previous history entry */}
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        router.back()
      </button>

      {/* replace: replaces current history entry (no back button) */}
      <button
        type="button"
        onClick={() => router.replace("/nav-demo/page-b")}
        className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
      >
        router.replace()
      </button>
    </div>
  );
}
