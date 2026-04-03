import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Blades in the Dark — Character Sheets",
  description: "Track your crew and characters in Blades in the Dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
