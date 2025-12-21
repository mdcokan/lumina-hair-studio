// src/content/gallery.ts

// Gallery images configuration
export type GalleryImage = {
  src: string;
  alt: string;
};

export const galleryImages: GalleryImage[] = Array.from({ length: 12 }, (_, i) => ({
  src: `/gallery/${i + 1}.jpg`,
  alt: `Lumina Hair Studio Galeri ${i + 1}`,
}));

// Gallery section metadata
export const galleryTitle = "Önce & Sonra";
export const galleryDescription = "Müşterilerimizin dönüşüm hikayeleri";

// Video links for the Videos section
export const videoLinks = [
  {
    url: "https://www.youtube.com/embed/A4dcDdzePRE",
    title: "Lumina Hair Studio – Saç Bakım",
    platform: "youtube",
  },
  {
    url: "https://www.youtube.com/embed/dfqk5PBuQ2s",
    title: "Lumina Hair Studio – Salon Atmosferi",
    platform: "youtube",
  },
  {
    url: "https://www.youtube.com/embed/vjIWdKxKTBw",
    title: "Lumina Hair Studio – Öncesi & Sonrası",
    platform: "youtube",
  },
  {
    url: "https://www.youtube.com/embed/Pe-ZJCNwLeQ",
    title: "Lumina Hair Studio – Saç Tasarım",
    platform: "youtube",
  },
] as const;

// Videos section metadata
export const videosTitle = "Videolar";
export const videosDescription = "Çalışmalarımızdan örnekler";
