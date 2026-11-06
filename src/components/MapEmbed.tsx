'use client';

import { useEffect, useRef, useState } from 'react';
import { mapEmbedUrl, locationUrl } from '@/src/content/contact';

export default function MapEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full rounded-2xl overflow-hidden shadow-2xl aspect-video bg-[#1F1F1F]">
      {visible ? (
        <iframe src={mapEmbedUrl} className="w-full h-full" style={{ border: 0 }}
          allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Lumina Hair Studio Harita" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-[#CFC7BC]">
          <p>İnönü Mahallesi · Yenişehir / Mersin</p>
          <a href={locationUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-full border border-[#D8CFC4]/30 px-5 py-3 text-[#F5F3EF]">Yol tarifi al</a>
        </div>
      )}
    </div>
  );
}
