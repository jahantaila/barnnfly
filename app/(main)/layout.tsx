import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bark & Fly × Derby Digital — Brand Survey",
  description:
    "Help shape Bark & Fly Pet Resort's brand. A 5-minute founder survey from Derby Digital.",
  metadataBase: new URL("https://barknfly.example.com"),
  openGraph: {
    title: "Bark & Fly — Brand Survey",
    description:
      "Shape the brand, logo, and voice of Bark & Fly Pet Resort. Powered by Derby Digital.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grainy relative">
        {children}
      </body>
    </html>
  );
}
