"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPostRecord } from "../data";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Save to database (simulated in-memory store)
  const post = createPostRecord({ title, content });

  // Revalidate the posts list so it shows the new post
  revalidatePath("/posts");

  // Redirect to the newly created post
  // With JavaScript this is a client-side navigation. Without it
  // (progressive enhancement), the browser gets a 303 redirect.
  redirect(`/posts/${post.slug}`);
}
