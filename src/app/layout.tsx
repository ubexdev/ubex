import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#d97706",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "UBEX — Arqueología Digital",
    template: "%s | UBEX",
  },
  description:
    "Explora ciudades reales en Google Street View. Resuelve enigmas geoespaciales. Compite contra miles de exploradores. El primero en completar todas las misiones gana.",
  keywords: [
    "UBEX",
    "arqueología digital",
    "Google Street View",
    "juego exploración",
    "geolocalización",
    "treasure hunt",
    "geo game",
  ],
  authors: [{ name: "UBEX" }],
  creator: "UBEX",
  metadataBase: new URL("https://ubex.vercel.app"),
  openGraph: {
    type: "website",
    locale: "es_DO",
    alternateLocale: "en_US",
    url: "https://ubex.vercel.app",
    siteName: "UBEX",
    title: "UBEX — Arqueología Digital",
    description:
      "Explora ciudades reales en Google Street View. Resuelve enigmas geoespaciales.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UBEX — El mundo es una base de datos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UBEX — Arqueología Digital",
    description:
      "Explora ciudades reales en Google Street View. Resuelve enigmas geoespaciales.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "UBEX",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
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
