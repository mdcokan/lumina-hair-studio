'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  galleryImages,
  galleryTitle,
  galleryDescription,
} from '@/src/content/gallery';

export default function GallerySection() {
  const [erroredImages, setErroredImages] = useState<Set<number>>(new Set());
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const lastNavAt = useRef<number>(0);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyboard = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const now = Date.now();
          if (now - lastNavAt.current >= 60) {
            lastNavAt.current = now;
            if (e.key === 'ArrowLeft') {
              prevImage();
            } else if (e.key === 'ArrowRight') {
              nextImage();
            }
          }
        }
      };
      window.addEventListener('keydown', handleKeyboard);
      return () => {
        window.removeEventListener('keydown', handleKeyboard);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    if (isLightboxOpen && galleryImages.length > 0) {
      const current = currentImageIndex;
      const len = galleryImages.length;
      const next = (current + 1) % len;
      const prev = (current - 1 + len) % len;

      const nextImg = new window.Image();
      nextImg.src = galleryImages[next].src;

      const prevImg = new window.Image();
      prevImg.src = galleryImages[prev].src;
    }
  }, [isLightboxOpen, currentImageIndex]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleError = (index: number) => {
    setErroredImages((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <>
      <section id="galeri" className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#181818]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-6 tracking-tight">
              {galleryTitle}
            </h2>
            <p className="text-xl text-[#CFC7BC] max-w-3xl mx-auto leading-relaxed">
              {galleryDescription}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {galleryImages.map((image, index) => {
              const hasError = erroredImages.has(index);

              return (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer aspect-[3/4]"
                  onClick={() => !hasError && openLightbox(index)}
                >
                  {hasError ? (
                    <div className="w-full h-full bg-[#1F1F1F] flex items-center justify-center border border-[#D8CFC4]/20">
                      <div className="text-center p-4">
                        <svg
                          className="w-12 h-12 mx-auto text-[#D8CFC4] opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-2 text-xs text-[#D8CFC4] font-medium">
                          Fotoğraf {index + 1}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={500}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      quality={75}
                      onError={() => handleError(index)}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-150 ease-out"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#D8CFC4]/10 hover:bg-[#D8CFC4]/20 rounded-full text-[#D8CFC4] transition-opacity duration-150 ease-out backdrop-blur-sm"
            aria-label="Önceki"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#D8CFC4]/10 hover:bg-[#D8CFC4]/20 rounded-full text-[#D8CFC4] transition-opacity duration-150 ease-out backdrop-blur-sm"
            aria-label="Sonraki"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center transition-opacity duration-150 ease-out">
              {!erroredImages.has(currentImageIndex) ? (
                <Image
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  width={1600}
                  height={1200}
                  className="w-full h-full object-contain"
                  quality={75}
                  priority
                  onError={() => handleError(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-full bg-[#1F1F1F] flex items-center justify-center border border-[#D8CFC4]/20">
                  <div className="text-center p-8">
                    <svg
                      className="w-24 h-24 mx-auto text-[#D8CFC4] opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-4 text-lg text-[#D8CFC4] font-medium">
                      Fotoğraf {currentImageIndex + 1}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0E0E0E]/80 backdrop-blur-sm text-[#D8CFC4] px-4 py-2 rounded-full text-sm border border-[#D8CFC4]/20">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

