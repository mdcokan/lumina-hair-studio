import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lumina-hairstudio.com"),
  title: "Lumina Hair Studio | Mersin Kadın Kuaför - Yenişehir Çiftlikköy",
  description:
    "Mersin Yenişehir ve Çiftlikköy bölgesinde kadın kuaför hizmetleri. Saç kesimi, ombre, balyaj ve saç boyama. Profesyonel kadın kuaför salonu. WhatsApp ile randevu alın.",
  keywords: [
    "mersin kadın kuaför",
    "yenişehir kadın kuaför",
    "çiftlikköy kuaför",
    "mersin çiftlikköy kuaför",
    "ombre saç mersin",
    "kuaför mersin",
    "saç kesimi mersin",
    "saç boyama mersin",
    "balayage mersin",
    "balyaj mersin",
    "keratin bakımı mersin",
    "yenişehir kuaför",
    "premium kuaför mersin",
    "saç bakımı mersin",
    "düğün saç mersin",
    "lumina hair studio",
    "kişiye özel saç kesimi",
    "hijyen odaklı kuaför",
    "mersin saç tasarımı",
    "profesyonel saç bakımı",
  ],
  authors: [{ name: "Lumina Hair Studio" }],
  creator: "Lumina Hair Studio",
  publisher: "Lumina Hair Studio",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",

  openGraph: {
    title: "Lumina Hair Studio | Mersin Kadın Kuaför - Yenişehir Çiftlikköy",
    description:
      "Mersin Yenişehir ve Çiftlikköy bölgesinde kadın kuaför hizmetleri. Saç kesimi, ombre, balyaj ve saç boyama. Profesyonel kadın kuaför salonu. WhatsApp ile randevu alın.",
    type: "website",
    locale: "tr_TR",
    siteName: "Lumina Hair Studio",
    url: "https://www.lumina-hairstudio.com",
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
    title: "Lumina Hair Studio | Mersin Kadın Kuaför - Yenişehir Çiftlikköy",
    description:
      "Mersin Yenişehir ve Çiftlikköy bölgesinde kadın kuaför hizmetleri. Saç kesimi, ombre, balyaj ve saç boyama. Profesyonel kadın kuaför salonu. WhatsApp ile randevu alın.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Lumina Hair Studio",
    telephone: "+905523803696",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yenişehir",
      addressRegion: "Mersin",
      addressCountry: "TR",
    },
    sameAs: ["https://www.instagram.com/lumina.hair_studio?igsh=MTJpNWI2YWNoMjZ6Zg=="],
    url: "https://www.lumina-hairstudio.com",
    priceRange: "₺₺",
    areaServed: {
      "@type": "City",
      name: "Mersin",
    },
  };

  return (
    <html lang="tr">
      <head>
        {/* Google Tag Manager (GTM) */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TX25HPZ5');
          `}
        </Script>

        {/* Google Ads (gtag.js) */}
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
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TX25HPZ5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}
      </body>
    </html>
  );
}
