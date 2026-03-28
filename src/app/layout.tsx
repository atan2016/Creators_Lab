import type { Metadata } from "next";
import "./globals.css";
import "./creators-lab-styles.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "CreatorsLab — Enrich Youth Innovations",
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
        <SessionProvider>{children}</SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
