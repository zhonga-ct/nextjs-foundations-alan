import "server-only";

// Simulated product database for the Cache Components lesson.
// In-memory (resets on server restart) with a Prisma-like API, and a delay
// so cache hits are visibly faster than misses.

export type ProductRecord = {
  id: string;
  name: string;
  price: number;
  inventory: number;
};

type ProductUpdate = Partial<Omit<ProductRecord, "id">>;

// Kept on globalThis so every server module instance shares one store
const globalForDb = globalThis as typeof globalThis & {
  __demoProducts?: Map<string, ProductRecord>;
};

globalForDb.__demoProducts ??= new Map<string, ProductRecord>([
  ["123", { id: "123", name: "Widget Pro", price: 99, inventory: 42 }],
  ["456", { id: "456", name: "Gadget Plus", price: 149, inventory: 7 }],
  ["789", { id: "789", name: "Tool Master", price: 199, inventory: 0 }],
]);

const products = globalForDb.__demoProducts;

const SIMULATED_LATENCY_MS = 800;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

export const db = {
  products: {
    async findMany(): Promise<ProductRecord[]> {
      await delay();
      return [...products.values()];
    },

    async findUnique({
      where,
    }: {
      where: { id: string };
    }): Promise<ProductRecord | null> {
      await delay();
      return products.get(where.id) ?? null;
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: ProductUpdate;
    }): Promise<ProductRecord> {
      const existing = products.get(where.id);
      if (!existing) {
        throw new Error(`Product ${where.id} not found`);
      }
      const updated = { ...existing, ...data };
      products.set(where.id, updated);
      return updated;
    },

    async delete({ where }: { where: { id: string } }): Promise<void> {
      if (!products.delete(where.id)) {
        throw new Error(`Product ${where.id} not found`);
      }
    },
  },
};
