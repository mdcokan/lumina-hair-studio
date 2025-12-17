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
  metadataBase: new URL('https://lumina-hair-studio.vercel.app'),
  title: "Lumina Hair Studio | Yenişehir Mersin Premium Kuaför Salonu",
  description: "Yenişehir/Mersin'de Lumina Hair Studio: saç kesimi, boya, balayage, keratin bakımı ve özel gün paketleri. 10+ yıl tecrübe, 5.0 Google puanı. WhatsApp'tan hızlı randevu alın.",
  keywords: [
    "kuaför mersin",
    "saç kesimi mersin",
    "saç boyama mersin",
    "balayage mersin",
    "keratin bakımı mersin",
    "yenişehir kuaför",
    "premium kuaför",
    "saç bakımı mersin",
    "düğün saç mersin",
    "lumina hair studio"
  ],
  authors: [{ name: "Lumina Hair Studio" }],
  creator: "Lumina Hair Studio",
  publisher: "Lumina Hair Studio",
  openGraph: {
    title: "Lumina Hair Studio | Yenişehir Mersin Premium Kuaför Salonu",
    description: "Yenişehir/Mersin'de Lumina Hair Studio: saç kesimi, boya, balayage, keratin bakımı ve özel gün paketleri. 10+ yıl tecrübe, 5.0 Google puanı.",
    type: "website",
    locale: "tr_TR",
    siteName: "Lumina Hair Studio",
    url: "https://lumina-hair-studio.vercel.app",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumina Hair Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina Hair Studio | Yenişehir Mersin Premium Kuaför",
    description: "Yenişehir/Mersin'de premium saç bakım hizmetleri. 10+ yıl tecrübe, 5.0 Google puanı.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
