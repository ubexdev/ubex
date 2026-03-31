import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UBEX — Arqueología Digital",
  description:
    "Explora calles reales en Google Street View, resuelve acertijos históricos y reclama el tesoro. Impulsada por Google Gemini AI.",
  keywords: [
    "búsqueda de tesoros",
    "arqueología digital",
    "Google Maps",
    "Street View",
    "aventura urbana",
    "UBEX",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-zinc-950 text-zinc-100 font-[family-name:var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}
