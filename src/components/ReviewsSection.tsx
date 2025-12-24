'use client';

import { useEffect, useRef, useState } from 'react';

interface Review {
  name: string;
  rating: number;
  comment: string;
}

const fallbackReviews: Review[] = [
  {
    name: 'Ayşe Yılmaz',
    rating: 5,
    comment:
      'Harika bir deneyim! Ekibiniz çok profesyonel ve sonuç muhteşem. Kesinlikle tekrar geleceğim.',
  },
  {
    name: 'Zeynep Demir',
    rating: 5,
    comment:
      'Balayage yaptırdım ve hayal ettiğimden bile güzel oldu. Çok memnun kaldım, herkese tavsiye ederim.',
  },
  {
    name: 'Elif Kaya',
    rating: 5,
    comment:
      'Keratin bakımı yaptırdım, saçlarım çok yumuşak ve parlak. Salonunuzun atmosferi de çok güzel.',
  },
  {
    name: 'Mehmet Öz',
    rating: 5,
    comment:
      'Eşim için düğün paketi aldık. Hem saç hem makyaj mükemmeldi. Çok teşekkürler!',
  },
  {
    name: 'Selin Arslan',
    rating: 5,
    comment:
      'Fön ve şekillendirme hizmeti aldım. Çok memnun kaldım, özel günlerimde mutlaka geleceğim.',
  },
  {
    name: 'Can Yıldız',
    rating: 5,
    comment:
      'Kesim ve bakım hizmeti aldım. Profesyonel yaklaşım ve kaliteli hizmet. Kesinlikle tavsiye ederim.',
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [placeRating, setPlaceRating] = useState<number | undefined>(undefined);
  const [userRatingCount, setUserRatingCount] = useState<number | undefined>(undefined);
  const [googleUrl, setGoogleUrl] = useState<string | undefined>(undefined);
  const [placeId, setPlaceId] = useState<string | undefined>(undefined);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState(3);

  const reviewsList = reviews.length > 0 ? reviews : fallbackReviews;

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetch('/api/google-reviews');
        if (response.ok) {
          const data = await response.json();
          if (data.reviews && data.reviews.length > 0) {
            const formattedReviews: Review[] = data.reviews.map((review: any) => ({
              name: review.authorName || 'Anonim',
              rating: review.rating || 5,
              comment: (typeof review.text === "string" ? review.text : review.text?.text) ?? "",
            }));
            setReviews(formattedReviews);
            if (typeof data.rating === 'number') {
              setPlaceRating(data.rating);
            }
            if (typeof data.userRatingCount === 'number') {
              setUserRatingCount(data.userRatingCount);
            }
            if (typeof data.googleUrl === 'string') {
              setGoogleUrl(data.googleUrl);
            }
            if (typeof data.placeId === 'string') {
              setPlaceId(data.placeId);
            }
            setIsLoadingReviews(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching Google reviews:', error);
      }
      setReviews(fallbackReviews);
      setIsLoadingReviews(false);
    };

    fetchReviews();
  }, []);

  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView());
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(reviewsList.length / cardsPerView));

  const goToSlide = (index: number) => {
    const maxSlide = totalSlides - 1;
    const newIndex = Math.max(0, Math.min(index, maxSlide));
    setCurrentSlide(newIndex);

    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const gap = 24;
      const cardWidth = (containerWidth - gap * (cardsPerView - 1)) / cardsPerView;
      const slideWidth = cardWidth * cardsPerView + gap * (cardsPerView - 1);
      const scrollPosition = newIndex * slideWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const nextSlide = () => {
    const maxSlide = totalSlides - 1;
    if (currentSlide < maxSlide) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0);
    }
  };

  const prevSlide = () => {
    const maxSlide = totalSlides - 1;
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(maxSlide);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        const gap = 24;
        const cardWidth = (containerWidth - gap * (cardsPerView - 1)) / cardsPerView;
        const scrollLeft = carouselRef.current.scrollLeft;
        const slideWidth = cardWidth * cardsPerView + gap * (cardsPerView - 1);
        const slideIndex = Math.round(scrollLeft / slideWidth);
        setCurrentSlide(Math.max(0, Math.min(slideIndex, totalSlides - 1)));
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [cardsPerView, totalSlides]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        carousel.scrollBy({
          left: e.deltaY,
          behavior: 'smooth',
        });
      }
    };

    carousel.addEventListener('wheel', handleWheel, { passive: false });
    return () => carousel.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <section id="yorumlar" className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#181818]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-8 tracking-tight text-center sm:text-left">
              Google Yorumları
            </h2>

            {(placeRating !== undefined || userRatingCount !== undefined) && (
              <div className="bg-gradient-to-br from-[#1F1F1F] to-[#181818] rounded-3xl p-6 lg:p-8 border border-[#D8CFC4]/10 shadow-lg mb-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const rating = placeRating || 0;
                          const isFilled = i < Math.floor(rating);
                          return (
                            <svg
                              key={i}
                              className={`w-6 h-6 ${
                                isFilled ? 'text-[#D8CFC4]' : 'text-[#CFC7BC] opacity-30'
                              }`}
                              fill={isFilled ? 'currentColor' : 'none'}
                              stroke={isFilled ? 'none' : 'currentColor'}
                              strokeWidth={isFilled ? 0 : 1}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        })}
                      </div>
                      {placeRating !== undefined && (
                        <>
                          <span className="text-3xl font-bold text-[#F5F3EF]">
                            {placeRating.toFixed(1)}
                          </span>
                          {userRatingCount !== undefined && (
                            <span className="text-lg text-[#CFC7BC]">
                              {userRatingCount} yorum
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#D8CFC4]/10 border border-[#D8CFC4]/20 rounded-full px-3 py-1.5">
                      <svg
                        className="w-3.5 h-3.5 text-[#D8CFC4]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[#CFC7BC] text-xs font-medium">
                        Google'da doğrulanmış müşteri yorumları
                      </span>
                    </div>
                  </div>

                  {(googleUrl || placeId) && (
                    <a
                      href={googleUrl || `https://www.google.com/maps/place/?q=place_id:${placeId}&hl=tr&gl=TR`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/8 backdrop-blur-sm px-4 py-3 rounded-xl border border-[#D8CFC4]/15 hover:bg-white/12 hover:border-[#D8CFC4]/25 hover:shadow-[0_0_12px_rgba(216,207,196,0.15)] transition-all duration-250 ease-out group shrink-0"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-[10px] leading-none">G</span>
                      </div>
                      <span className="text-[#D8CFC4] font-medium text-sm tracking-tight">Tüm Google yorumlarını gör</span>
                      <svg
                        className="w-4 h-4 text-[#D8CFC4] transition-transform group-hover:translate-x-1"
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
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative group">
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#1F1F1F]/90 hover:bg-[#1F1F1F] text-[#D8CFC4] rounded-full shadow-lg border border-[#D8CFC4]/20 hover:border-[#D8CFC4]/40 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110"
                aria-label="Önceki yorumlar"
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
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#1F1F1F]/90 hover:bg-[#1F1F1F] text-[#D8CFC4] rounded-full shadow-lg border border-[#D8CFC4]/20 hover:border-[#D8CFC4]/40 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110"
                aria-label="Sonraki yorumlar"
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
                ref={carouselRef}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex gap-6 lg:gap-8">
                  {isLoadingReviews ? (
                    <>
                      {[0, 1, 2].map((skeleton) => (
                        <div
                          key={`skeleton-${skeleton}`}
                          className={`${skeleton === 0 ? 'flex' : skeleton === 1 ? 'hidden md:flex' : 'hidden lg:flex'} flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start`}
                        >
                          <div className="bg-[#1F1F1F] p-8 lg:p-10 rounded-2xl shadow-lg border border-[#D8CFC4]/10 w-full">
                            <div className="flex items-center gap-1 mb-6">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded bg-[#D8CFC4]/10 animate-shimmer"
                                />
                              ))}
                            </div>
                            <div className="mb-6 space-y-2">
                              <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer" />
                              <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-5/6" />
                              <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-4/6" />
                              <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-3/6" />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-[#D8CFC4]/10 animate-shimmer" />
                              <div className="flex-1">
                                <div className="h-5 bg-[#D8CFC4]/10 rounded animate-shimmer w-24" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    reviewsList.map((review, index) => {
                      const shouldShowReadMore = review.comment.length > 220;

                      return (
                        <div
                          key={index}
                          className="flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start"
                        >
                          <div className="bg-[#1F1F1F] p-6 lg:p-8 rounded-[24px] shadow-lg border border-[#D8CFC4]/10 hover:shadow-2xl hover:shadow-[#D8CFC4]/5 transition-all duration-250 ease-out transform hover:-translate-y-[2px] hover:border-[#D8CFC4]/15 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                  <span className="text-white font-semibold text-[8px] leading-none">G</span>
                                </div>
                                <span className="text-[#CFC7BC] text-xs font-medium">Doğrulandı</span>
                              </div>
                              <svg
                                className="w-5 h-5 text-[#D8CFC4]/30"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l1 2.016c-2.053.783-3.946 2.9-4.946 5.609h4.946v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l1 2.016c-2.053.783-3.946 2.9-4.946 5.609h4.946v10h-10z" />
                              </svg>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-5 h-5 text-[#D8CFC4]"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>

                            <div className="flex-grow mb-4">
                              <p
                                className="text-[#CFC7BC] leading-relaxed italic text-base font-light"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                "{review.comment}"
                              </p>
                              {shouldShowReadMore && (
                                <button
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setIsReviewModalOpen(true);
                                  }}
                                  className="mt-2 text-[#D8CFC4] text-sm underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                                >
                                  Devamını oku
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-[#D8CFC4]/10">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D8CFC4] to-[#C4B5A8] flex items-center justify-center text-[#0E0E0E] font-semibold text-base shadow-sm flex-shrink-0">
                                {review.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[#F5F3EF] font-semibold text-base tracking-tight truncate">{review.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'w-3 h-3 bg-[#D8CFC4]'
                        : 'w-2 h-2 bg-[#CFC7BC] opacity-40 hover:opacity-60'
                    }`}
                    aria-label={`Sayfa ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isReviewModalOpen && selectedReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="bg-[#1F1F1F] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D8CFC4]/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 lg:p-10">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-[#D8CFC4] hover:text-[#F5F3EF] transition-colors duration-200"
                aria-label="Kapat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-[8px] leading-none">G</span>
                  </div>
                  <span className="text-[#CFC7BC] text-xs font-medium">Doğrulandı</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: selectedReview.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-[#D8CFC4]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#CFC7BC] leading-relaxed italic text-lg font-light mb-8">
                "{selectedReview.comment}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-[#D8CFC4]/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D8CFC4] to-[#C4B5A8] flex items-center justify-center text-[#0E0E0E] font-semibold text-lg shadow-sm">
                  {selectedReview.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#F5F3EF] font-semibold text-lg tracking-tight">{selectedReview.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

