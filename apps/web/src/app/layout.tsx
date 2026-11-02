// Root layout: wraps ALL pages, provides html/body structure
// Keep this minimal: no section-specific chrome here

import type { Metadata } from "next";

import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen">
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
