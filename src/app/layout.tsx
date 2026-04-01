import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import { I18nProvider } from "@/i18n";
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
  title: "UBEX",
  description:
    "Explore real streets in Google Street View, solve geospatial riddles, and claim the treasure. Powered by Google Gemini AI.",
  keywords: [
    "treasure hunt",
    "digital archaeology",
    "Google Maps",
    "Street View",
    "urban adventure",
    "UBEX",
    "búsqueda de tesoros",
    "arqueología digital",
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
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
