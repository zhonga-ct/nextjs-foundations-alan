"use client";

import { useState } from "react";
import { updateProduct } from "@/app/actions/products";

export function ProductForm({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setResult(null);

    const result = await updateProduct(product.id, {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      inventory: Number(formData.get("inventory")),
    });

    setLoading(false);

    if (result.success) {
      setResult({
        success: true,
        message: "Product updated! Cache invalidated.",
      });
    } else {
      setResult({
        success: false,
        message: result.error || "Failed to update",
      });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          defaultValue={product.name}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="inventory">Inventory</label>
        <input
          id="inventory"
          name="inventory"
          type="number"
          defaultValue={product.inventory}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {result && (
        <p className={result.success ? "text-green-600" : "text-red-600"}>
          {result.message}
        </p>
      )}
    </form>
  );
}

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}
