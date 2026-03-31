import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UBEX — El Mundo es el Tablero",
  description:
    "Plataforma de arqueología digital. Explora calles reales en Google Street View, resuelve acertijos y encuentra el tesoro. Impulsada por Google Gemini AI.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
