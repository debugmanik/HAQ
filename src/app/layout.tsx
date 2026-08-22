import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HAQProvider } from "@/lib/store";
import { Header } from "@/components/haq/Header";
import { Footer } from "@/components/haq/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HAQ — Legal & Civil Help",
  description: "Help Indian citizens describe a civic or legal problem, understand their route, get action checklists, and generate RTI drafts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <HAQProvider>
          <Header />
          <main className="flex-grow flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </HAQProvider>
      </body>
    </html>
  );
}
