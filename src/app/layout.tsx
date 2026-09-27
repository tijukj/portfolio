import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIJU K JOHN — Portfolio",
  description: "Swiss / International Typographic Style Portfolio of Tiju K John — MBA Candidate, Marketing & Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-swiss-bg text-swiss-text font-sans antialiased selection:bg-swiss-text selection:text-swiss-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
