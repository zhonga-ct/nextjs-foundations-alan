import { connection } from "next/server";
import { Suspense } from "react";
import { UserCard } from "@/components/user-card";
import { getUserDTO } from "@/lib/server/user-dto";

export default function SecurityDemoPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="font-bold text-2xl">Security Demo</h1>
      <p className="text-gray-600">
        This page demonstrates secure data fetching patterns.
      </p>
      <Suspense fallback={<p className="text-gray-500">Loading user…</p>}>
        <SafeUser />
      </Suspense>
    </main>
  );
}

async function SafeUser() {
  // The simulated DB stamps createdAt with the current time, which needs request time
  await connection();

  // Server Component safely calls the Data Access Layer
  const user = getUserDTO("user-123");

  // Pass only the safe DTO to the Client Component
  return <UserCard user={user} />;
}
