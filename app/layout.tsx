import type { Metadata } from "next";
import { siteUrl, siteTitle, siteDescription, shareImage, salonPhoto } from "@/src/content/site";
import Script from "next/script";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { phoneLink, streetAddress, locationUrl } from "@/src/content/contact";


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "mersin kadın kuaför",
    "yenişehir kadın kuaför",
    "inönü kuaför",
    "pozcu kadın kuaförü",
    "göçmen kadın kuaförü",
    "mersin bayan kuaförü",
    "mersin inönü kuaför",
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
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "tr_TR",
    siteName: "Lumina Hair Studio",
    url: "https://www.lumina-hairstudio.com",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [shareImage],
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
    "@id": siteUrl + "/#salon",
    name: "Lumina Hair Studio",
    description: siteDescription,
    image: [siteUrl + salonPhoto, siteUrl + shareImage.url],
    geo: { "@type": "GeoCoordinates", latitude: 36.7807429, longitude: 34.5968293 },
    telephone: phoneLink.slice(4),
    hasMap: locationUrl,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "00:00", closes: "00:00" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress,
      postalCode: "33130",
      addressLocality: "Yenişehir",
      addressRegion: "Mersin",
      addressCountry: "TR",
    },
    sameAs: ["https://www.instagram.com/lumina.hair_studio?igsh=MTJpNWI2YWNoMjZ6Zg=="],
    url: "https://www.lumina-hairstudio.com",
    priceRange: "₺₺",
    areaServed: [
      { "@type": "City", name: "Mersin" },
      { "@type": "AdministrativeArea", name: "Yenişehir" },
      { "@type": "Place", name: "Pozcu" },
      { "@type": "Place", name: "Göçmen" },
    ],
  };

  return (
    <html lang="tr">
      <head>
        {/* Google Tag Manager (GTM) */}
        <Script id="gtm" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TX25HPZ5');
          `}
        </Script>

        {/* Google Ads AW-17775158966 and Analytics are managed by GTM-TX25HPZ5. */}
      </head>

      <body className="antialiased min-h-screen flex flex-col">
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

          <main className="flex-1">
            {children}
          </main>

          {/* Global Footer - Meta İşletme Doğrulaması */}
          <footer className="bg-[#0E0E0E] border-t border-[#D8CFC4]/10">
            <div className="container mx-auto max-w-7xl px-4 pt-3 pb-2">
              <p className="text-xs opacity-70 text-[#CFC7BC] text-center">
                İşletme Sahibi: Toprak Efe Çokan
              </p>
              <div className="mt-2 flex flex-col items-center gap-0 border-t border-[#D8CFC4]/10 pt-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Web tasarım &amp; yazılım</p>
                <a href="https://mcwebportal.com/tr/" target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-xs text-sky-300 transition-colors hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300" aria-label="MC Web Portal Yazılım Hizmetleri — yeni sekmede açılır">
                  <span><span className="font-semibold text-sky-300 transition-colors group-hover:text-sky-200">MC Web Portal</span> Yazılım Hizmetleri</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
                </a>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation Spacer */}
          <div className="h-[calc(72px+env(safe-area-inset-bottom,0px))] md:hidden" aria-hidden="true" />

          {/* Mobile Bottom Navigation */}
          <BottomNav />
      </body>
    </html>
  );
}
