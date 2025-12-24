'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { videoLinks, videosTitle, videosDescription } from '@/src/content/gallery';

const SectionFallback = ({ id, title }: { id: string; title: string }) => (
  <section id={id} className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#181818]">
    <div className="container mx-auto max-w-7xl">
      <div className="text-center space-y-4">
        <div className="mx-auto h-10 w-40 rounded-full bg-[#D8CFC4]/10 animate-pulse" aria-hidden />
        <div className="mx-auto h-4 w-64 rounded-full bg-[#D8CFC4]/8 animate-pulse" aria-hidden />
        <p className="text-[#CFC7BC] text-sm">"{title}" yükleniyor...</p>
      </div>
    </div>
  </section>
);

const GallerySection = dynamic(() => import('@/src/components/GallerySection'), {
  ssr: false,
  loading: () => <SectionFallback id="galeri" title="Galeri" />,
});

const ReviewsSection = dynamic(() => import('@/src/components/ReviewsSection'), {
  ssr: false,
  loading: () => <SectionFallback id="yorumlar" title="Google Yorumları" />,
});

const MapEmbed = dynamic(() => import('@/src/components/MapEmbed'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl aspect-video bg-[#1F1F1F] flex items-center justify-center text-[#CFC7BC]">
      Harita yükleniyor...
    </div>
  ),
});

export default function Home() {
  const heroSrc = "/images/hero.webp";
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const videoCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 400);
      
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
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const phoneDisplay = '0 552 380 36 96';
  const phoneLink = 'tel:+905523803696';
  const whatsappUrl = 'https://wa.me/905523803696';
  const whatsappMessage = encodeURIComponent('Merhaba, randevu almak istiyorum.');
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${whatsappMessage}`;
  const locationUrl = 'https://maps.app.goo.gl/TfNNCKN6BnggyMoJ8';

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Carousel functions
  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out ${
          isScrolled
            ? 'bg-[#0E0E0E]/95 backdrop-blur-lg shadow-lg border-b border-[#D8CFC4]/12'
            : 'bg-[#0E0E0E]'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#D8CFC4] hover:text-[#C4B5A8] transition-colors duration-200">
                Lumina Hair Studio
              </div>
            </a>

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
      <section className="relative min-h-[70vh] w-full flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroSrc}
            alt="Lumina Hair Studio"
            fill
            priority
            quality={65}
            sizes="100vw"
            className="object-cover brightness-[1.08] contrast-[1.08] saturate-[1.05]"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="absolute inset-0 bg-black/18 z-10" />
        <div className="relative z-20 container mx-auto max-w-7xl py-36">
          {/* Premium glass panel container */}
          <div className="text-center flex flex-col gap-4 md:gap-6 max-w-5xl mx-auto bg-black/10 md:bg-black/10 backdrop-blur-md rounded-[30px] border border-white/10 shadow-2xl px-6 py-8 md:px-10 md:py-10 opacity-80">
            <h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5] leading-[1.15] tracking-[-0.02em]">
              Mersin Yenişehir'de Profesyonel Kadın Kuaförü
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#D8CFC4] leading-relaxed">
              Saçınıza ışıltı, size güven.
            </h2>
            <p className="text-lg sm:text-xl text-[#CFC7BC]/95 leading-relaxed max-w-md md:max-w-xl mx-auto font-light">
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <div className="flex flex-col items-center gap-2">
                <a
                  href={whatsappUrlWithMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 bg-[#D8CFC4] hover:bg-[#C4B5A8] text-[#0E0E0E] px-6 md:px-10 py-4 md:py-5 rounded-full font-semibold text-[15px] md:text-lg leading-none md:leading-normal whitespace-nowrap transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full max-w-[340px] md:w-auto md:max-w-none"
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
                <p className="text-xs text-[#CFC7BC]/70 font-light">Randevu için WhatsApp'tan hızlı dönüş.</p>
              </div>
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-transparent hover:bg-[#1F1F1F]/30 text-[#D8CFC4] px-10 py-5 rounded-full font-semibold text-lg transition-all duration-200 border border-[#D8CFC4]/15 hover:border-[#D8CFC4]/30 hover:bg-[#D8CFC4]/5"
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
                className="bg-[#1F1F1F] rounded-[24px] hover:shadow-2xl transition-all duration-200 ease-out transform hover:-translate-y-1 border border-[#D8CFC4]/12 group overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[24px]">
                  <Image
                    src={`/services/service-${index + 1}.jpg`}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
                  />
                  {/* Premium Gradient Overlay - altta koyulaşsın */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 opacity-90" />
                </div>
                
                {/* Content */}
                <div className="p-8 lg:p-10">
                  <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#CFC7BC] leading-relaxed mb-6 font-light">
                    {service.description}
                  </p>
                  <a
                    href={whatsappUrlWithMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#D8CFC4] hover:text-[#C4B5A8] font-semibold text-sm transition-all duration-200 group-hover:gap-3"
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

      <GallerySection />

      {/* Videos Section */}
      <section id="videolar" className="py-20 bg-[#0E0E0E]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] mb-4">
              {videosTitle}
            </h2>
            <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
              Salonumuzdan kısa anlar—kesim, bakım ve dönüşümler. Beğendiğin stili randevuda birlikte seçelim.
            </p>
          </div>
          {/* Horizontal Scroll Container with Navigation */}
          <div className="relative">
            {/* Left Arrow Button */}
            <button
              onClick={() => {
                if (videoCarouselRef.current) {
                  const firstCard = videoCarouselRef.current.querySelector('div[class*="flex-none"]') as HTMLElement;
                  if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = window.innerWidth >= 768 ? 32 : 24;
                    const scrollAmount = cardWidth + gap;
                    videoCarouselRef.current.scrollBy({
                      left: -scrollAmount,
                      behavior: 'smooth',
                    });
                  }
                }
              }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-black/40 border border-white/10 hover:bg-black/60 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Önceki video"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {/* Right Arrow Button */}
            <button
              onClick={() => {
                if (videoCarouselRef.current) {
                  const firstCard = videoCarouselRef.current.querySelector('div[class*="flex-none"]') as HTMLElement;
                  if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = window.innerWidth >= 768 ? 32 : 24;
                    const scrollAmount = cardWidth + gap;
                    videoCarouselRef.current.scrollBy({
                      left: scrollAmount,
                      behavior: 'smooth',
                    });
                  }
                }
              }}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-black/40 border border-white/10 hover:bg-black/60 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Sonraki video"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            {/* Carousel Container */}
            <div 
              ref={videoCarouselRef}
              className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 md:gap-8 px-4 md:px-8 pb-2 py-2 scrollbar-hide touch-pan-x"
            >
              {videoLinks.map((video, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8 hover:shadow-[0_18px_50px_rgba(0,0,0,0.55)] flex-none snap-start w-[78vw] md:w-[380px] lg:w-[340px] xl:w-[360px]"
                >
                  <div className="relative aspect-[9/16] w-full">
                    <iframe
                      src={`${video.url}?autoplay=0&mute=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full rounded-2xl"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="p-4 bg-[#181818]">
                    <h3 className="font-semibold text-[#F5F3EF] mb-3">{video.title}</h3>
                    <a
                      href="#iletisim"
                      className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                    >
                      Randevu Al →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />

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

            <MapEmbed />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E0E0E] text-[#F5F3EF] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#D8CFC4]/10">
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

      {/* Floating Buttons Container */}
      <div 
        className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 items-end"
        style={{
          bottom: 'max(6rem, calc(6rem + env(safe-area-inset-bottom, 0rem)))',
          right: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))',
        }}
      >
        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-[#1F1F1F] hover:bg-[#2a2a2a] text-[#D8CFC4] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[#D8CFC4]/20 border border-[#D8CFC4]/15 hover:border-[#D8CFC4]/25 transition-all duration-200 ease-out transform hover:scale-110"
            aria-label="Yukarı çık"
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
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}

        {/* Instagram Button */}
        <a
          href="https://www.instagram.com/lumina.hair_studio?igsh=MTJpNWI2YWNoMjZ6Zg=="
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
          aria-label="Instagram'da takip et"
        >
          <svg
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrlWithMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 scale-[0.9] sm:scale-100 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
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
    </div>
  );
}
