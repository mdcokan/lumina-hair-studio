import type { MetadataRoute } from 'next';
import { siteUrl } from '@/src/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date('2026-11-06'), changeFrequency: 'monthly', priority: 1, images: [siteUrl + '/images/lumina-salon-dis-cephe.webp'] },
    { url: siteUrl + '/fiyatlar', lastModified: new Date('2026-11-06'), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
