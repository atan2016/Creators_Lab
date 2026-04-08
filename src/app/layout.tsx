import type { Metadata } from "next";
import "./globals.css";
import "./creators-lab-styles.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { MetaPixel } from "@/components/MetaPixel";

export const metadata: Metadata = {
  title: "Creators Lab — Enrich Youth Innovations",
  description: "Empower the next generation to dream big, build boldly, and innovate fearlessly.",
  icons: {
    icon: '/assets/images/favicon_rocket.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MetaPixel />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
