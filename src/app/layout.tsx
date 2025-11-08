import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { // embeded on discord, etc
  title: "ARCANE - A Virtural Puzzle Hunt",
  description: "Embark on a mystical journey through the mountains. Retrace the steps of those before you by deciphering 7 artifacts and rediscover secrets of the past.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
