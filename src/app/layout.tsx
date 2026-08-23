import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HAQProvider } from "@/lib/store";
import { LanguageProvider } from "@/lib/i18n";
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
  title: "HAQ — Indian Civic & Legal Intelligence Platform",
  description: "Empowering Indian citizens to navigate legal grievances, assert constitutional & statutory rights, draft formal legal notices & RTI applications, and connect with verified advocates.",
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
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <LanguageProvider>
          <HAQProvider>
            <Header />
            <main className="flex-grow flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </HAQProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
