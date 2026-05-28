import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VedaAI Assessment Creator",
  description: "AI-powered assessment creator for teachers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}