// Server-side redirect for authentication
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await getSession();

  // Redirect unauthenticated users to login
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 font-bold text-2xl">Protected Content</h1>
      <p>Welcome, {session.user.name}!</p>
    </main>
  );
}
