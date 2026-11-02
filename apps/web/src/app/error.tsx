"use client";

// Root error boundary - catches all runtime errors not handled by nested boundaries
// Must be a Client Component: error boundaries use React state internally

import { useEffect } from "react";

// Rename to ErrorBoundary to avoid shadowing global Error
export default function ErrorBoundary({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: Error logging is intentional for debugging
    console.error("Root error boundary caught:", error);
  }, [error]);

  // Server Component errors arrive as Error instances. Client code can throw anything.
  const message = error instanceof Error ? error.message : String(error);
  const digest =
    error instanceof Error && "digest" in error
      ? String(error.digest)
      : undefined;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="mb-2 font-bold text-2xl text-red-800">
          Something went wrong
        </h2>
        <p className="mb-4 text-red-600">
          {message || "An unexpected error occurred"}
        </p>
        {/* digest is Next.js's auto-generated error ID for production - a unique hash that correlates client errors with server logs */}
        {digest && (
          <p className="mb-4 font-mono text-red-400 text-xs">
            Error ID: {digest}
          </p>
        )}
        <button
          type="button"
          onClick={() => retry()}
          className="rounded bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
