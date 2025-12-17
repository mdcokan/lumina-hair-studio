import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumina Hair Studio | Yenişehir Mersin Bayan Kuaför",
  description: "Yenişehir/Mersin'de Lumina Hair Studio: saç kesimi, boya, ombre, keratin ve bakım hizmetleri. WhatsApp'tan hızlı randevu.",
  openGraph: {
    title: "Lumina Hair Studio | Yenişehir Mersin Bayan Kuaför",
    description: "Yenişehir/Mersin'de Lumina Hair Studio: saç kesimi, boya, ombre, keratin ve bakım hizmetleri. WhatsApp'tan hızlı randevu.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Lumina Hair Studio",
    telephone: "+905523803696",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yenişehir",
      addressRegion: "Mersin",
      addressCountry: "TR",
    },
    sameAs: [],
    url: "http://localhost:3000",
  };

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
