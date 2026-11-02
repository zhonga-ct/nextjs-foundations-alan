"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

/**
 * Fetch a single product by ID with caching.
 * Cache invalidated via updateTag() after user mutations.
 */
export async function getProduct(id: string) {
  cacheLife("products"); // 5min fresh, 15min revalidate, 1hr expire
  cacheTag("products", `product-${id}`); // Tag for invalidation

  const product = await db.products.findUnique({ where: { id } });
  if (!product) {
    return null;
  }

  // cachedAt shows when this cache entry was created
  return {
    ...product,
    cachedAt: new Date().toISOString(),
  } satisfies Product & {
    cachedAt: string;
  };
}

/**
 * Fetch all products with caching.
 */
export async function getProducts() {
  cacheLife("products");
  cacheTag("products"); // Invalidate when any product changes

  const products: Product[] = await db.products.findMany();
  return products;
}

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}
