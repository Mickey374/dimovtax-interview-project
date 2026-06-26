import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const inter = localFont({
  src: "../fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Dimovtax Interview Project",
  description: "A SaaS dashboard app built with Next.js, TypeScript, Tailwind CSS, and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className={`${inter.variable} flex min-h-full flex-col`}>{children}</body>
    </html>
  );
}
