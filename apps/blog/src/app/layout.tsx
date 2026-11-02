import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  // Include the /blog basePath so relative metadata URLs keep it
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/blog`
      : 'http://localhost:3001/blog'
  ),
  title: {
    template: '%s | VAF Blog',
    default: 'Vercel Academy Foundation - Blog',
  },
  description: 'Articles and tutorials from the VAF team',
  openGraph: {
    siteName: 'VAF Blog',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container mx-auto px-4 py-8">{children}</body>
    </html>
  );
}
