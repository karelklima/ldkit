import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Linked Data Movie Database",
  description: "Browse and search movies and actors from Wikidata",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black min-h-screen">
      <body className="bg-white">
        <Header />
        <main className="container max-w-6xl mx-auto px-8 py-8 min-h-[80vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
