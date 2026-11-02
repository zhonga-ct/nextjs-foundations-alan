import Link from "next/link";
import { getProducts } from "@/lib/products";

// Product list: getProducts() is cached, so this whole page prerenders.
// Its links prefetch each product page's static shell (Partial Prefetching).
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-3xl">Products</h1>
      <ul className="space-y-3">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="block rounded-lg border p-4 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="font-semibold">{product.name}</span>
              <span className="ml-2 text-gray-500 text-sm">
                ${product.price} · {product.inventory} in stock
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
