import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harshit Sharma — Backend Engineer",
  description:
    "An interactive cinematic portfolio exploring backend engineering, systems, and production software.",
  openGraph: {
    title: "Harshit Sharma — Backend Engineer",
    description: "An interactive cinematic portfolio exploring backend engineering, systems, and production software.",
    url: "https://harshitfolio.vercel.app", // Replace with actual deployed URL if different
    siteName: "Harshit Sharma Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshit Sharma — Backend Engineer",
    description: "An interactive cinematic portfolio exploring backend engineering, systems, and production software.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
