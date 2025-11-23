import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import { prisma } from "@/lib/prisma";

// Font definitions
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chapters = await prisma.chapter.findMany({
    orderBy: { number: 'asc' },
    select: { id: true, number: true, title: true }
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden bg-background text-foreground`}
      >
        <Sidebar chapters={chapters} />
        <main className="flex-1 overflow-y-auto relative w-full flex flex-col">
          <TopBar />
          <div className="flex-1">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
