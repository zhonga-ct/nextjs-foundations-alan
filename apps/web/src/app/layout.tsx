// Root layout: wraps ALL pages, provides html/body structure
// Keep this minimal: no section-specific chrome here

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

// Variable font: all weights in a single self-hosted, latin-subset file
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true, // Size-matched fallback prevents CLS on swap
});

// Monospace font for code blocks
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Next.js Foundations",
    default: "Next.js Foundations",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html className={`${inter.variable} ${jetbrainsMono.variable}`} lang="en">
      <body className="min-h-screen font-sans">
        {/* Global providers would go here (theme, auth, etc.) */}
        {children}
        {/* TODO: Replace this hand-rolled integration in Section 4 Lesson 3. */}
        {gaId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
