// Marketing section layout: header, footer, nav
// (marketing) is a route group - doesn't affect URL structure
// Routes: /, /about, /pricing (NOT /marketing/about)

import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Marketing header - persists across all marketing pages */}
      <header className="mb-8 border-b py-4">
        <nav className="mx-auto flex max-w-4xl gap-4 px-4">
          <Link href="/" className="font-semibold">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          {/* Link to dashboard (different layout) */}
          <Link
            href="/dashboard"
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            Dashboard →
          </Link>
        </nav>
      </header>

      {/* Page content renders here */}
      <main className="mx-auto max-w-4xl px-4">{children}</main>

      {/* Marketing footer - persists across all marketing pages */}
      <footer className="mx-auto mt-8 max-w-4xl border-t px-4 py-4 text-gray-500 text-sm">
        © 2026 Next.js Foundations
      </footer>
    </div>
  );
}
