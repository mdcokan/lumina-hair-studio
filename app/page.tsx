'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  galleryImages,
  galleryTitle,
  galleryDescription,
  videoLinks,
  videosTitle,
  videosDescription,
} from '@/src/content/gallery';

interface Review {
  name: string;
  rating: number;
  comment: string;
}

// Fallback reviews (hardcoded)
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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [placeRating, setPlaceRating] = useState<number | undefined>(undefined);
  const [userRatingCount, setUserRatingCount] = useState<number | undefined>(undefined);
  const [googleUrl, setGoogleUrl] = useState<string | undefined>(undefined);
  const [placeId, setPlaceId] = useState<string | undefined>(undefined);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastNavAt = useRef<number>(0);

  // Fetch Google reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetch('/api/google-reviews');
        if (response.ok) {
          const data = await response.json();
          if (data.reviews && data.reviews.length > 0) {
            // Map Google reviews to our format
            const formattedReviews: Review[] = data.reviews.map((review: any) => ({
              name: review.authorName || 'Anonim',
              rating: review.rating || 5,
              comment: (typeof review.text === "string" ? review.text : review.text?.text) ?? "",
            }));
            setReviews(formattedReviews);
            // Set rating and userRatingCount from API
            if (typeof data.rating === 'number') {
              setPlaceRating(data.rating);
            }
            if (typeof data.userRatingCount === 'number') {
              setUserRatingCount(data.userRatingCount);
            }
            // Set googleUrl and placeId from API
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
      // Fallback to hardcoded reviews if API fails
      setReviews(fallbackReviews);
      setIsLoadingReviews(false);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Active section tracking
      const sections = ['hizmetler', 'galeri', 'yorumlar', 'iletisim'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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

  // Preload next/prev images when lightbox is open
  useEffect(() => {
    if (isLightboxOpen && galleryImages.length > 0) {
      const current = currentImageIndex;
      const len = galleryImages.length;
      const next = (current + 1) % len;
      const prev = (current - 1 + len) % len;

      // Preload next image
      const nextImg = new window.Image();
      nextImg.src = galleryImages[next].src;

      // Preload prev image
      const prevImg = new window.Image();
      prevImg.src = galleryImages[prev].src;
    }
  }, [isLightboxOpen, currentImageIndex]);

  const phoneDisplay = '0 552 380 36 96';
  const phoneLink = 'tel:+905523803696';
  const whatsappUrl = 'https://wa.me/905523803696';
  const whatsappMessage = encodeURIComponent('Merhaba, randevu almak istiyorum.');
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${whatsappMessage}`;
  const locationUrl = 'https://maps.app.goo.gl/TfNNCKN6BnggyMoJ8';

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Carousel functions
  const reviewsList = reviews.length > 0 ? reviews : fallbackReviews;
  
  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3; // Desktop
    if (window.innerWidth >= 768) return 2; // Tablet
    return 1; // Mobile
  };

  const [cardsPerView, setCardsPerView] = useState(3);

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
      const gap = 24; // gap-6 = 24px
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

  // Handle scroll to update current slide
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

  // Handle mouse wheel for horizontal scrolling
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
    <div className="min-h-screen bg-[#0E0E0E]">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0E0E0E]/98 backdrop-blur-lg shadow-lg border-b border-[#D8CFC4]/20'
            : 'bg-[#0E0E0E]'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#D8CFC4]">
                Lumina Hair Studio
          </h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#hizmetler"
                className={`transition-colors font-medium ${
                  activeSection === 'hizmetler'
                    ? 'text-[#D8CFC4] font-semibold'
                    : 'text-[#CFC7BC] hover:text-[#D8CFC4]'
                }`}
              >
                Hizmetler
              </a>
              <a
                href="#galeri"
                className={`transition-colors font-medium ${
                  activeSection === 'galeri'
                    ? 'text-[#D8CFC4] font-semibold'
                    : 'text-[#CFC7BC] hover:text-[#D8CFC4]'
                }`}
              >
                Galeri
              </a>
              <a
                href="#yorumlar"
                className={`transition-colors font-medium ${
                  activeSection === 'yorumlar'
                    ? 'text-[#D8CFC4] font-semibold'
                    : 'text-[#CFC7BC] hover:text-[#D8CFC4]'
                }`}
              >
                Yorumlar
              </a>
              <a
                href="#iletisim"
                className={`transition-colors font-medium ${
                  activeSection === 'iletisim'
                    ? 'text-[#D8CFC4] font-semibold'
                    : 'text-[#CFC7BC] hover:text-[#D8CFC4]'
                }`}
              >
                İletişim
              </a>
            </nav>

            {/* WhatsApp CTA Button */}
            <a
              href={whatsappUrlWithMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#D8CFC4] hover:bg-[#0E0E0E] hover:text-[#D8CFC4] hover:border border-[rgba(216,207,196,0.45)] text-[#0E0E0E] px-4 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Randevu Al
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors p-2"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
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
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
          )}
          
          {/* Mobile Menu Dropdown */}
          <div
            className={`md:hidden fixed top-20 left-0 right-0 bg-[#181818] shadow-2xl z-50 overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <nav className="pt-4 pb-6 border-t border-[#D8CFC4]/20">
              <div className="flex flex-col space-y-4">
                <a
                  href="#hizmetler"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Hizmetler
                </a>
                <a
                  href="#galeri"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Galeri
                </a>
                <a
                  href="#yorumlar"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Yorumlar
                </a>
                <a
                  href="#iletisim"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  İletişim
                </a>
                <a
                  href={whatsappUrlWithMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl mt-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Randevu Al
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero.png" 
            alt="Lumina Hair Studio Hero" 
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/45 via-black/35 to-black/60 md:from-black/55 md:via-black/45 md:to-black/70" />
        <div className="relative z-20 container mx-auto max-w-7xl py-36">
          <div className="text-center flex flex-col gap-4 md:gap-6 max-w-5xl mx-auto bg-black/10 backdrop-blur-sm rounded-2xl px-6 py-6 md:px-10 md:py-8">
            <h1 className="text-4xl md:text-6xl font-bold text-[#F5F3EF] leading-relaxed tracking-tight">
              Saçınıza ışıltı,
              <br />
              <span className="text-[#D8CFC4]">
                size güven.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-[#CFC7BC] leading-relaxed max-w-md md:max-w-xl mx-auto">
              Yenişehir/Mersin'de kişiye özel saç kesimi, renklendirme ve bakım uygulamaları ile 
              hayalinizdeki görünüme kavuşun. Profesyonel ekibimiz, modern teknikler ve premium 
              ürünlerle saçlarınıza özenle yaklaşıyor.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-[#181818] backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-[#D8CFC4]/20">
                <svg className="w-5 h-5 text-[#D8CFC4]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-[#D8CFC4]">Google 5.0 ★</span>
              </div>
              <div className="flex items-center gap-2 bg-[#181818] backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-[#D8CFC4]/20">
                <svg className="w-5 h-5 text-[#D8CFC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-semibold text-[#D8CFC4]">Hijyen Odaklı Hizmet</span>
              </div>
              <div className="flex items-center gap-2 bg-[#181818] backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-[#D8CFC4]/20">
                <svg className="w-5 h-5 text-[#D8CFC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-semibold text-[#D8CFC4]">Kişiye Özel Danışmanlık</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrlWithMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 md:gap-3 bg-[#D8CFC4] hover:bg-[#C4B5A8] text-[#0E0E0E] px-6 md:px-10 py-4 md:py-5 rounded-full font-semibold text-[15px] md:text-lg leading-none md:leading-normal whitespace-nowrap transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full max-w-[340px] md:w-auto md:max-w-none"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="whitespace-nowrap">WhatsApp ile Randevu Al</span>
              </a>
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#181818] hover:bg-[#1F1F1F] text-[#D8CFC4] px-10 py-5 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-[#D8CFC4]/20 hover:border-[#D8CFC4]/40"
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Yol Tarifi Al
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="hizmetler" className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#181818]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-6 tracking-tight">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-[#CFC7BC] max-w-3xl mx-auto leading-relaxed">
              Profesyonel ekibimizle sunduğumuz kapsamlı saç bakım ve stil hizmetleri
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Kesim & Stil',
                description: 'Yüz hatlarınıza uygun, kişiye özel kesim teknikleri ile modern ve klasik stilleri harmanlayarak hayalinizdeki görünüme ulaşın. Her kesim, saç tipiniz ve yaşam tarzınıza göre özenle tasarlanır.',
                icon: '✂️',
              },
              {
                title: 'Boyama & Balayage',
                description: 'Profesyonel renklendirme teknikleri ve premium boyalar ile saçlarınıza doğal ışıltı kazandırın. Balayage, ombre ve full color uygulamalarında uzman ekibimiz size eşlik eder.',
                icon: '🎨',
              },
              {
                title: 'Saç Bakımı',
                description: 'Derinlemesine bakım tedavileri ile saçlarınızı güçlendirin, nemlendirin ve parlaklık kazandırın. Saç tipinize özel seçilen profesyonel bakım ürünleri ile sağlıklı saçlara kavuşun.',
                icon: '💆',
              },
              {
                title: 'Fön & Şekillendirme',
                description: 'Özel günleriniz ve günlük yaşamınız için profesyonel fön ve şekillendirme hizmetleri. Modern teknikler ile istediğiniz stile kavuşun ve gün boyu koruyun.',
                icon: '✨',
              },
              {
                title: 'Keratin Bakımı',
                description: 'Premium keratin tedavileri ile saçlarınızı düzleştirin, yumuşatın ve yönetilebilir hale getirin. Friz kontrolü ve uzun süreli parlaklık için ideal çözüm.',
                icon: '🌟',
              },
              {
                title: 'Özel Paketler',
                description: 'Düğün, nişan ve özel günleriniz için kapsamlı paket hizmetlerimiz. Saç tasarımından makyaja kadar tüm ihtiyaçlarınızı tek çatı altında karşılıyoruz.',
                icon: '💐',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-[#1F1F1F] rounded-[24px] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-[2px] border border-[#D8CFC4]/20 group overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[24px]">
                  <Image
                    src={`/services/service-${index + 1}.jpg`}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/20 pointer-events-none" />
                </div>
                
                {/* Content */}
                <div className="p-8 lg:p-10">
                  <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-[#CFC7BC] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <a
                    href={whatsappUrlWithMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#D8CFC4] hover:text-[#C4B5A8] font-semibold text-sm transition-colors group-hover:gap-3"
                  >
                    Detay Al
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="hakkimizda" className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-6 tracking-tight">
              Hakkımızda
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-[#CFC7BC] leading-relaxed mb-6">
                <strong>Lumina Hair Studio</strong>, Yenişehir Mersin'de kadın kuaförü olarak saç kesimi, renklendirme ve bakım hizmetleri sunan modern bir salondur. Bayan kuaför ve saç tasarım uygulamalarında uzman ekibimizle kişiye özel çözümler sunuyoruz.
              </p>
              <p className="text-xl text-[#CFC7BC] leading-relaxed mb-6">
                Lumina Hair Studio olarak, Yenişehir/Mersin'de saç bakım ve stil alanında 
                müşterilerimize en yüksek kalitede hizmet sunmayı hedefliyoruz. 
              </p>
              <p className="text-xl text-[#CFC7BC] leading-relaxed mb-6">
                Uzman ekibimiz, modern teknikler ve premium ürünler kullanarak her müşterimize 
                kişiye özel çözümler sunar. Hijyen standartlarımız ve müşteri memnuniyeti 
                odaklı yaklaşımımız ile saçlarınıza ışıltı, size güven veriyoruz.
              </p>
              <p className="text-xl text-[#CFC7BC] leading-relaxed">
                Google 5.0 puanımız ve 15+ müşteri yorumumuz, kalite anlayışımızın en güzel 
                göstergesidir. Sizleri de Lumina Hair Studio ailesine katılmaya davet ediyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
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
              const hasError = imageErrors.has(index);
              
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
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-150 ease-out"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#D8CFC4]/10 hover:bg-[#D8CFC4]/20 rounded-full text-[#D8CFC4] transition-opacity duration-150 ease-out backdrop-blur-sm"
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

          {/* Previous Button */}
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

          {/* Next Button */}
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

          {/* Image Container */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center transition-opacity duration-150 ease-out">
              {!imageErrors.has(currentImageIndex) ? (
                <Image
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  width={1600}
                  height={1200}
                  className="w-full h-full object-contain"
                  quality={75}
                  priority={true}
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

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0E0E0E]/80 backdrop-blur-sm text-[#D8CFC4] px-4 py-2 rounded-full text-sm border border-[#D8CFC4]/20">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Videos Section */}
      <section id="videolar" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] mb-4">
              {videosTitle}
            </h2>
            <p className="text-lg text-[#CFC7BC] max-w-2xl mx-auto">
              {videosDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoLinks.map((video, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-[#1F1F1F] border border-[#D8CFC4]/20"
              >
                {video.platform === 'youtube' ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={video.url}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-video w-full bg-[#1F1F1F] flex items-center justify-center group border border-[#D8CFC4]/20"
                  >
                    <div className="text-center p-6">
                      <svg
                        className="w-16 h-16 mx-auto text-[#D8CFC4] opacity-50 group-hover:opacity-75 transition-opacity"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <p className="mt-4 text-[#D8CFC4] font-medium">{video.title}</p>
                      <p className="mt-2 text-sm text-[#CFC7BC]">Instagram'da Görüntüle</p>
                    </div>
                  </a>
                )}
                <div className="p-4 bg-[#181818]">
                  <h3 className="font-semibold text-[#F5F3EF]">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="yorumlar" className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#181818]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-8 tracking-tight text-center sm:text-left">
              Google Yorumları
            </h2>
            
            {/* Premium Rating Summary Panel */}
            {(placeRating !== undefined || userRatingCount !== undefined) && (
              <div className="bg-gradient-to-br from-[#1F1F1F] to-[#181818] rounded-3xl p-6 lg:p-8 border border-[#D8CFC4]/10 shadow-lg mb-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Left: Rating Info */}
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
                    {/* Verification Badge */}
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
                  
                  {/* Right: CTA Button */}
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
            {/* Carousel Container */}
            <div className="relative group">
              {/* Navigation Buttons */}
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

              {/* Carousel */}
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
                    // Skeleton Cards (responsive: mobile 1, tablet 2, desktop 3)
                    <>
                      <div
                        key="skeleton-0"
                        className="flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start"
                      >
                        <div className="bg-[#1F1F1F] p-8 lg:p-10 rounded-2xl shadow-lg border border-[#D8CFC4]/10">
                          {/* Stars Skeleton */}
                          <div className="flex items-center gap-1 mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded bg-[#D8CFC4]/10 animate-shimmer"
                              />
                            ))}
                          </div>
                          {/* Text Skeleton */}
                          <div className="mb-6 space-y-2">
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-5/6" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-4/6" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-3/6" />
                          </div>
                          {/* Author Skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#D8CFC4]/10 animate-shimmer" />
                            <div className="flex-1">
                              <div className="h-5 bg-[#D8CFC4]/10 rounded animate-shimmer w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        key="skeleton-1"
                        className="hidden md:flex flex-shrink-0 w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start"
                      >
                        <div className="bg-[#1F1F1F] p-8 lg:p-10 rounded-2xl shadow-lg border border-[#D8CFC4]/10 w-full">
                          {/* Stars Skeleton */}
                          <div className="flex items-center gap-1 mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded bg-[#D8CFC4]/10 animate-shimmer"
                              />
                            ))}
                          </div>
                          {/* Text Skeleton */}
                          <div className="mb-6 space-y-2">
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-5/6" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-4/6" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-3/6" />
                          </div>
                          {/* Author Skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#D8CFC4]/10 animate-shimmer" />
                            <div className="flex-1">
                              <div className="h-5 bg-[#D8CFC4]/10 rounded animate-shimmer w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        key="skeleton-2"
                        className="hidden lg:flex flex-shrink-0 w-[calc((100%-48px)/3)] snap-start"
                      >
                        <div className="bg-[#1F1F1F] p-8 lg:p-10 rounded-2xl shadow-lg border border-[#D8CFC4]/10 w-full">
                          {/* Stars Skeleton */}
                          <div className="flex items-center gap-1 mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded bg-[#D8CFC4]/10 animate-shimmer"
                              />
                            ))}
                          </div>
                          {/* Text Skeleton */}
                          <div className="mb-6 space-y-2">
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-5/6" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-4/6" />
                            <div className="h-4 bg-[#D8CFC4]/10 rounded animate-shimmer w-3/6" />
                          </div>
                          {/* Author Skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#D8CFC4]/10 animate-shimmer" />
                            <div className="flex-1">
                              <div className="h-5 bg-[#D8CFC4]/10 rounded animate-shimmer w-24" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Real Reviews
                    (reviews.length > 0 ? reviews : fallbackReviews).map((review, index) => {
                      const isExpanded = expandedReviews.has(index);
                      const commentLength = review.comment.length;
                      const shouldShowReadMore = commentLength > 220;
                      
                      const toggleExpand = () => {
                        setExpandedReviews(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(index)) {
                            newSet.delete(index);
                          } else {
                            newSet.add(index);
                          }
                          return newSet;
                        });
                      };
                      
                      return (
                        <div
                          key={index}
                          className="flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start"
                        >
                          <div className="bg-[#1F1F1F] p-6 lg:p-8 rounded-[24px] shadow-lg border border-[#D8CFC4]/10 hover:shadow-2xl hover:shadow-[#D8CFC4]/5 transition-all duration-250 ease-out transform hover:-translate-y-[2px] hover:border-[#D8CFC4]/15 flex flex-col h-full">
                            {/* Header: Google Logo + Verified Chip */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                  <span className="text-white font-semibold text-[8px] leading-none">G</span>
                                </div>
                                <span className="text-[#CFC7BC] text-xs font-medium">Doğrulandı</span>
                              </div>
                              {/* Quote Icon */}
                              <svg
                                className="w-5 h-5 text-[#D8CFC4]/30"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l1 2.016c-2.053.783-3.946 2.9-4.946 5.609h4.946v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l1 2.016c-2.053.783-3.946 2.9-4.946 5.609h4.946v10h-10z" />
                              </svg>
                            </div>
                            
                            {/* Stars */}
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
                            
                            {/* Review Text with expand/collapse */}
                            <div className="flex-grow mb-4">
                              <p 
                                className={`text-[#CFC7BC] leading-relaxed italic text-base font-light transition-all duration-250 ${
                                  isExpanded ? '' : 'line-clamp-5'
                                }`}
                                style={isExpanded ? {} : {
                                  display: '-webkit-box',
                                  WebkitLineClamp: 5,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                "{review.comment}"
                              </p>
                              {shouldShowReadMore && (
                                <button
                                  onClick={toggleExpand}
                                  className="mt-2 text-[#D8CFC4] text-sm underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                                >
                                  {isExpanded ? 'Daha az göster' : 'Devamını oku'}
                                </button>
                              )}
                            </div>
                            
                            {/* Author Section */}
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

              {/* Dots Indicator */}
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

      {/* Location & Hours Section */}
      <section id="iletisim" className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-6 tracking-tight">
              Bize Ulaşın
            </h2>
            <p className="text-xl text-[#CFC7BC] max-w-3xl mx-auto leading-relaxed">
              Yenişehir/Mersin'de sizleri bekliyoruz
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Address & Hours */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#D8CFC4]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Adres
                </h3>
                <p className="text-[#CFC7BC] text-lg leading-relaxed">
                  Çiftlikköy Sokak 3215 Kapı No: 1 | L.K.V Royal
                  <br />
                  33110 Yenişehir/Mersin
                </p>
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[#D8CFC4] hover:text-[#C4B5A8] font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Yol Tarifi Al
                </a>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#D8CFC4]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Çalışma Saatleri
                </h3>
                <div className="space-y-2 text-[#CFC7BC] text-lg">
                  <div className="flex justify-between">
                    <span>Pazartesi - Cuma</span>
                    <span className="font-semibold">09:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumartesi</span>
                    <span className="font-semibold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar</span>
                    <span className="font-semibold">Kapalı</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#D8CFC4]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  İletişim
                </h3>
                <p className="text-[#CFC7BC] text-lg mb-4">
                  <a
                    href={phoneLink}
                    className="hover:text-[#D8CFC4] transition-colors font-semibold"
                  >
                    {phoneDisplay}
                  </a>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={phoneLink}
                    className="inline-flex items-center justify-center gap-2 bg-[#D8CFC4] hover:bg-[#C4B5A8] text-[#0E0E0E] px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Ara
          </a>
          <a
                    href={whatsappUrlWithMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp ile İletişime Geç
                  </a>
                </div>
                <p className="text-sm text-[#CFC7BC] mt-4 text-center sm:text-left">
                  Google puanı: 5.0 • 15+ yorum
                </p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.0128495744057!2d34.5422867!3d36.7702592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15278bd3e5c40317%3A0xc0044e2791161d7f!2sLumina%20Hair%20Studio!5e0!3m2!1str!2str!4v1765976133270!5m2!1str!2str"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lumina Hair Studio Harita"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E0E0E] text-[#F5F3EF] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#D8CFC4]/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[#D8CFC4]">
                Lumina Hair Studio
              </h3>
              <p className="text-[#CFC7BC] leading-relaxed">
                Yenişehir/Mersin'de premium saç bakım ve stil hizmetleri sunan
                profesyonel kuaför salonu.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#D8CFC4]">Hızlı Linkler</h4>
              <ul className="space-y-2 text-[#CFC7BC]">
                <li>
                  <a
                    href="#hizmetler"
                    className="hover:text-[#D8CFC4] transition-colors"
                  >
                    Hizmetler
                  </a>
                </li>
                <li>
                  <a
                    href="#galeri"
                    className="hover:text-[#D8CFC4] transition-colors"
                  >
                    Galeri
                  </a>
                </li>
                <li>
                  <a
                    href="#yorumlar"
                    className="hover:text-[#D8CFC4] transition-colors"
                  >
                    Yorumlar
                  </a>
                </li>
                <li>
                  <a
                    href="#iletisim"
                    className="hover:text-[#D8CFC4] transition-colors"
                  >
                    İletişim
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#D8CFC4]">İletişim</h4>
              <ul className="space-y-2 text-[#CFC7BC]">
                <li>
                  <a
                    href={phoneLink}
                    className="hover:text-[#D8CFC4] transition-colors"
                  >
                    {phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
                    className="hover:text-[#D8CFC4] transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#D8CFC4]/20 pt-8 text-center text-[#CFC7BC]">
            <p>&copy; {new Date().getFullYear()} Lumina Hair Studio. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 scale-[0.9] sm:scale-100 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-pulse"
        aria-label="WhatsApp ile iletişime geç"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
