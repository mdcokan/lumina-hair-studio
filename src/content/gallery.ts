// src/content/gallery.ts

// Gallery images configuration
export const galleryImages: string[] = Array.from(
  { length: 12 },
  (_, i) => `/gallery/${i + 1}.jpg`
);

// Gallery section metadata
export const galleryTitle = "Önce & Sonra";
export const galleryDescription = "Müşterilerimizin dönüşüm hikayeleri";

// Video links for the Videos section
export const videoLinks = [
  {
    url: "https://www.youtube.com/embed/EtYnFICdZ-s",
    title: "Lumina Hair Studio • Kısa Dönüşüm",
    platform: "youtube",
  },
  {
    url: "https://www.youtube.com/embed/1RdKppXmstc",
    title: "Saç Bakım Anı • Parlaklık Dokunuşu",
    platform: "youtube",
  },
  {
    url: "https://www.youtube.com/embed/8DdRYjIDdvQ",
    title: "Yeni Stil • Öncesi & Sonrası",
    platform: "youtube",
  },
  {
    url: "https://www.instagram.com/reel/DSXxMcCDHR7/?igsh=cno5ZnhzcTFkZ3px",
    title: "Instagram Reels • Salon Anı 1",
    platform: "instagram",
  },
  {
    url: "https://www.instagram.com/reel/DSVN5vFDH4H/?igsh=MWJtd2pheXV0cDNlNg",
    title: "Instagram Reels • Salon Anı 2",
    platform: "instagram",
  },
  {
    url: "https://www.instagram.com/reel/DSVJewHjBs6/?igsh=bWF4ZXFwcGExNHQ4",
    title: "Instagram Reels • Salon Anı 3",
    platform: "instagram",
  },
] as const;

// Videos section metadata
export const videosTitle = "Videolar";
export const videosDescription = "Çalışmalarımızdan örnekler";
