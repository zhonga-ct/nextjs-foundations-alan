"use server";

import { updateTag } from "next/cache";
import { db } from "@/lib/db";

export async function updateProduct(
  id: string,
  data: { name?: string; price?: number; inventory?: number }
) {
  try {
    // Update in database
    await db.products.update({
      where: { id },
      data,
    });

    // The next render observes the successful write.
    updateTag(`product-${id}`);
    updateTag("products");

    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.products.delete({ where: { id } });

    updateTag(`product-${id}`);
    updateTag("products");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
