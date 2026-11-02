import "server-only";

import { cookies } from "next/headers";

// Mock session for the navigation lesson: a "demo-session" cookie holds the
// user's name. In a real app this would verify a signed session token.
export const SESSION_COOKIE = "demo-session";

export async function getSession(): Promise<{ user: { name: string } } | null> {
  const cookieStore = await cookies();
  const name = cookieStore.get(SESSION_COOKIE)?.value;

  return name ? { user: { name } } : null;
}
