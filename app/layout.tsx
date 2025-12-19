import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Lumina Hair Studio | Yenişehir Mersin Kadın Kuaförü",
  description: "Yenişehir Mersin'de kadınlara özel saç kesimi, renklendirme ve bakım. Lumina Hair Studio'da profesyonel ve premium kuaför hizmetleri.",
  keywords: [
    "kuaför mersin",
    "saç kesimi mersin",
    "saç boyama mersin",
    "balayage mersin",
    "keratin bakımı mersin",
    "yenişehir kuaför",
    "premium kuaför mersin",
    "saç bakımı mersin",
    "düğün saç mersin",
    "lumina hair studio",
    "kişiye özel saç kesimi",
    "hijyen odaklı kuaför",
    "mersin saç tasarımı",
    "profesyonel saç bakımı"
  ],
  authors: [{ name: "Lumina Hair Studio" }],
  creator: "Lumina Hair Studio",
  publisher: "Lumina Hair Studio",
  openGraph: {
    title: "Lumina Hair Studio | Yenişehir Mersin Kadın Kuaförü",
    description: "Yenişehir Mersin'de kadınlara özel saç kesimi, renklendirme ve bakım. Lumina Hair Studio'da profesyonel ve premium kuaför hizmetleri.",
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
    title: "Lumina Hair Studio | Yenişehir Mersin Kadın Kuaförü",
    description: "Yenişehir Mersin'de kadınlara özel saç kesimi, renklendirme ve bakım. Lumina Hair Studio'da profesyonel ve premium kuaför hizmetleri.",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17775158966"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17775158966');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
