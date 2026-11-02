"use client";

// Nested error boundary with correlation ID for debugging
// Demonstrates: different error UI, correlation tracking, and a Retry action

import { useEffect, useMemo } from "react";

// Generate a correlation ID for debugging
// In production, this helps trace errors across logs and support tickets
function generateCorrelationId(): string {
  return `err-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ErrorDemoBoundary({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  // Memoize so correlation ID stays stable during re-renders
  const correlationId = useMemo(() => generateCorrelationId(), []);

  // Server Component errors arrive as Error instances. Client code can throw anything.
  const message = error instanceof Error ? error.message : String(error);
  const digest =
    error instanceof Error && "digest" in error
      ? String(error.digest)
      : undefined;

  useEffect(() => {
    // Log error with correlation ID for debugging
    // In production: send to Sentry, DataDog, or your error reporting service
    const errorLog = {
      correlationId,
      digest,
      message,
      timestamp: new Date().toISOString(),
      location: "/error-demo",
    };
    // biome-ignore lint/suspicious/noConsole: Error logging is intentional
    console.error("Error demo boundary caught:", errorLog);
  }, [digest, message, correlationId]);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-6">
        <h2 className="mb-2 font-bold text-orange-800 text-xl">
          Demo Error Caught!
        </h2>
        <p className="mb-4 text-orange-700">
          This error was caught by the nested error boundary in /error-demo.
        </p>
        <p className="mb-4 font-mono text-orange-600 text-sm">{message}</p>
        {/* Correlation ID: give to users for support tickets */}
        <p className="mb-4 font-mono text-orange-400 text-xs">
          Correlation ID: {correlationId}
        </p>
        {digest && (
          <p className="mb-4 font-mono text-orange-400 text-xs">
            Digest: {digest}
          </p>
        )}
        <div className="flex gap-3">
          {/* retry() re-fetches and re-renders the segment */}
          <button
            type="button"
            onClick={() => retry()}
            className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Try Again
          </button>
          <a
            href="/error-demo"
            className="rounded border border-orange-600 px-4 py-2 text-orange-600 hover:bg-orange-100"
          >
            Reload Page
          </a>
        </div>
      </div>
    </div>
  );
}
