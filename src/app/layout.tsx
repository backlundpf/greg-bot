import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "reactflow/dist/style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Greg Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark font-sans`}>{children}</body>
    </html>
  );
}
