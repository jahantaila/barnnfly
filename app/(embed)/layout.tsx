import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import { EmbedResizer } from "@/components/EmbedResizer";

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
  title: "Bark & Fly — Brand Survey (Embed)",
  description: "Embedded Bark & Fly brand survey from Derby Digital.",
  robots: { index: false, follow: false },
};

// Separate root layout for the embed route group. Next.js supports multiple
// root layouts via sibling route groups — this lets /embed ship with a
// transparent background, no sticky header, and the postMessage resizer,
// while the main site keeps its normal chrome.
export default function EmbedRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoBlack.variable} antialiased`}
    >
      <body>
        <EmbedResizer />
        {children}
      </body>
    </html>
  );
}
