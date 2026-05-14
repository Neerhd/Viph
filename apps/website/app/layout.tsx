import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Viph — Scent Discovery for Online Stores",
  description:
    "Add a scent quiz to any product page in 10 minutes. Help shoppers find scents they'll love. Make more sales.",
  openGraph: {
    title: "Viph — Scent Discovery for Online Stores",
    description:
      "Add a scent quiz to any product page in 10 minutes. Help shoppers find scents they'll love.",
    type: "website",
  },
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "viph.co";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased bg-cream font-sans text-ink">{children}</body>
    </html>
  );
}
