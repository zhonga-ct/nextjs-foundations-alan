// Server-side redirect for authentication
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";

export default function ProtectedPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">Protected Content</h1>
      {/* cookies() is request data, so it reads inside a Suspense boundary */}
      <Suspense fallback={<p className="text-gray-500">Checking session…</p>}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome() {
  const session = await getSession();

  // Redirect unauthenticated users to login
  if (!session) {
    redirect("/login");
  }

  return <p>Welcome, {session.user.name}!</p>;
}
