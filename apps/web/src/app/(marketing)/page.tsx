import type { Metadata } from "next";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">Web</h1>

      <p>TODO: Content</p>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'About Us', // Becomes "About Us | Next.js Foundations"
}