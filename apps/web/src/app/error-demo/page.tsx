"use client";

// Page that throws errors to test the nested error boundary
// Must be Client Component to use useState for triggering errors

import { useState } from "react";

export default function ErrorDemoPage() {
  const [shouldError, setShouldError] = useState(false);

  // Throwing during render triggers the nearest error.tsx
  if (shouldError) {
    throw new Error("This is a demo error triggered by the button!");
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-3xl">Error Boundary Demo</h1>
      <p className="mb-6 text-gray-600">
        Click the button to trigger an error and see the nested error boundary.
      </p>
      <button
        type="button"
        onClick={() => setShouldError(true)}
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Trigger Error
      </button>
    </div>
  );
}
