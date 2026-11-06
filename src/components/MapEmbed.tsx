'use client';

import { mapEmbedUrl } from '@/src/content/contact';

export default function MapEmbed() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl aspect-video">
      <iframe
        src={mapEmbedUrl}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lumina Hair Studio Harita"
      />
    </div>
  );
}

