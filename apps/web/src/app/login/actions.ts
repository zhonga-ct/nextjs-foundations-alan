"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";

// Mock login: store the name in a cookie, then redirect server-side
export async function login(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim() || "Guest";

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, name, { httpOnly: true, path: "/" });

  redirect("/protected");
}
