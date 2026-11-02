import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/product-form";
import { getProduct } from "@/lib/products";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      {/* Static shell - prerenders and is prefetched for instant navigation */}
      <header>
        <h1 className="font-bold text-3xl">Product Details</h1>
      </header>

      {/* params is request data, so it is read inside the Suspense boundary */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>

      <footer className="text-gray-500 text-sm">ACME Corp</footer>
    </div>
  );
}

async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl">{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>In Stock: {product.inventory}</p>
        <p className="mt-2 font-mono text-gray-500 text-xs">
          Cached at: {product.cachedAt}
        </p>
      </div>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Edit product (calls updateTag)</h2>
        <ProductForm product={product} />
      </section>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
      <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
      <div className="h-6 w-24 rounded bg-gray-200" />
    </div>
  );
}
