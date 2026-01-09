'use client';

import { useState, useEffect, useRef } from 'react';

type PriceItem = {
  kategori: string;
  hizmet: string;
  sure: string;
  fiyat: string;
  not: string;
  sira: number;
};

type PricesData = {
  categories: { [category: string]: PriceItem[] };
  items: PriceItem[];
};

export default function FiyatlarPage() {
  const [data, setData] = useState<PricesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const prevOpenCategories = useRef<Set<string>>(new Set());

  const whatsappUrl = 'https://wa.me/905523803696';
  const whatsappMessage = encodeURIComponent('Merhaba, fiyat bilgisi almak istiyorum.');
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${whatsappMessage}`;
  const whatsappUrlMain = 'https://wa.me/905523803696';
  const whatsappMessageMain = encodeURIComponent('Merhaba, randevu almak istiyorum.');
  const whatsappUrlWithMessageMain = `${whatsappUrlMain}?text=${whatsappMessageMain}`;
  const phoneLink = 'tel:+905523803696';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices');
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const result = await response.json();
        setData(result);
        // Open all categories by default on desktop, closed on mobile
        if (typeof window !== 'undefined') {
          const isMobile = window.innerWidth < 768;
          if (!isMobile) {
            setOpenCategories(new Set(Object.keys(result.categories || {})));
          }
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError('Fiyat listesi yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Scroll to category when it opens (only on mobile)
  useEffect(() => {
    // Only scroll on mobile
    if (typeof window === 'undefined' || window.innerWidth >= 768) {
      prevOpenCategories.current = new Set(openCategories);
      return;
    }

    // Find newly opened category
    const newlyOpened = Array.from(openCategories).find(
      (cat) => !prevOpenCategories.current.has(cat)
    );

    // If no category was opened, just update prev ref
    if (!newlyOpened) {
      prevOpenCategories.current = new Set(openCategories);
      return;
    }

    // Wait for DOM to update and accordion animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const categoryElement = categoryRefs.current[newlyOpened];
          if (categoryElement) {
            // Scroll to category
            categoryElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });

            // Apply offset for header and bottom bar (mobile only)
            setTimeout(() => {
              window.scrollBy({
                top: -90,
                behavior: 'smooth',
              });
            }, 200);
          }
        }, 200);
      });
    });

    // Update prev ref
    prevOpenCategories.current = new Set(openCategories);
  }, [openCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-24 md:pb-0">
        {/* Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-200 ease-out ${
            isScrolled
              ? 'bg-[#0E0E0E]/95 backdrop-blur-lg shadow-lg border-b border-[#D8CFC4]/12'
              : 'bg-[#0E0E0E]'
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <a
                href="/"
                className="flex items-center cursor-pointer"
              >
                <div className="text-2xl sm:text-3xl font-bold text-[#D8CFC4] hover:text-[#C4B5A8] transition-colors duration-200">
                  Lumina Hair Studio
                </div>
              </a>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/#hizmetler" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">Hizmetler</a>
                <a href="/#galeri" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">Galeri</a>
                <a href="/#yorumlar" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">Yorumlar</a>
                <a href="/fiyatlar" className="transition-colors font-medium text-[#D8CFC4] font-semibold">Fiyatlarımız</a>
                <a href="/#iletisim" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">İletişim</a>
              </nav>
              <a
                href={whatsappUrlWithMessageMain}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-[#D8CFC4] hover:bg-[#0E0E0E] hover:text-[#D8CFC4] hover:border border-[rgba(216,207,196,0.45)] text-[#0E0E0E] px-4 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Randevu Al
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors p-2"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            {isMobileMenuOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden" onClick={closeMobileMenu} />
            )}
            <div
              className={`md:hidden fixed top-20 left-0 right-0 bg-[#181818] shadow-2xl z-[60] overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <nav className="pt-4 pb-6 border-t border-[#D8CFC4]/20">
                <div className="flex flex-col space-y-4">
                  <a href="/#hizmetler" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Hizmetler</a>
                  <a href="/#galeri" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Galeri</a>
                  <a href="/#yorumlar" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Yorumlar</a>
                  <a href="/fiyatlar" onClick={closeMobileMenu} className="text-[#D8CFC4] font-semibold transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Fiyatlarımız</a>
                  <a href="/#iletisim" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">İletişim</a>
                  <a href={whatsappUrlWithMessageMain} target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl mt-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Randevu Al
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mx-auto h-10 w-40 rounded-full bg-[#D8CFC4]/10 animate-pulse mb-4" />
            <p className="text-[#CFC7BC]">Fiyat listesi yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0">
        {/* Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-200 ease-out ${
            isScrolled
              ? 'bg-[#0E0E0E]/95 backdrop-blur-lg shadow-lg border-b border-[#D8CFC4]/12'
              : 'bg-[#0E0E0E]'
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <a href="/" className="flex items-center cursor-pointer">
                <div className="text-2xl sm:text-3xl font-bold text-[#D8CFC4] hover:text-[#C4B5A8] transition-colors duration-200">
                  Lumina Hair Studio
                </div>
              </a>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/#hizmetler" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">Hizmetler</a>
                <a href="/#galeri" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">Galeri</a>
                <a href="/#yorumlar" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">Yorumlar</a>
                <a href="/fiyatlar" className="transition-colors font-medium text-[#D8CFC4] font-semibold">Fiyatlarımız</a>
                <a href="/#iletisim" className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]">İletişim</a>
              </nav>
              <a
                href={whatsappUrlWithMessageMain}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-[#D8CFC4] hover:bg-[#0E0E0E] hover:text-[#D8CFC4] hover:border border-[rgba(216,207,196,0.45)] text-[#0E0E0E] px-4 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Randevu Al
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors p-2"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            {isMobileMenuOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden" onClick={closeMobileMenu} />
            )}
            <div
              className={`md:hidden fixed top-20 left-0 right-0 bg-[#181818] shadow-2xl z-[60] overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <nav className="pt-4 pb-6 border-t border-[#D8CFC4]/20">
                <div className="flex flex-col space-y-4">
                  <a href="/#hizmetler" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Hizmetler</a>
                  <a href="/#galeri" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Galeri</a>
                  <a href="/#yorumlar" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Yorumlar</a>
                  <a href="/fiyatlar" onClick={closeMobileMenu} className="text-[#D8CFC4] font-semibold transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">Fiyatlarımız</a>
                  <a href="/#iletisim" onClick={closeMobileMenu} className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]">İletişim</a>
                  <a href={whatsappUrlWithMessageMain} target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl mt-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Randevu Al
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <div className="py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-[#F5F3EF] mb-6">Fiyatlarımız</h1>
            <div className="bg-[#181818] rounded-2xl p-8 border border-[#D8CFC4]/12">
              <p className="text-[#CFC7BC] text-lg mb-6">
                Fiyat listesi şu an yüklenemedi. Lütfen WhatsApp&apos;tan yazın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={whatsappUrlWithMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp ile Fiyat Sor
                </a>
                <a
                  href={phoneLink}
                  className="inline-flex items-center justify-center gap-2 bg-[#D8CFC4] hover:bg-[#C4B5A8] text-[#0E0E0E] px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Ara
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(data.categories || {}).sort();

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-200 ease-out ${
          isScrolled
            ? 'bg-[#0E0E0E]/95 backdrop-blur-lg shadow-lg border-b border-[#D8CFC4]/12'
            : 'bg-[#0E0E0E]'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#D8CFC4] hover:text-[#C4B5A8] transition-colors duration-200">
                Lumina Hair Studio
              </div>
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/#hizmetler"
                className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]"
              >
                Hizmetler
              </a>
              <a
                href="/#galeri"
                className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]"
              >
                Galeri
              </a>
              <a
                href="/#yorumlar"
                className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]"
              >
                Yorumlar
              </a>
              <a
                href="/fiyatlar"
                className="transition-colors font-medium text-[#D8CFC4] font-semibold"
              >
                Fiyatlarımız
              </a>
              <a
                href="/#iletisim"
                className="transition-colors font-medium text-[#CFC7BC] hover:text-[#D8CFC4]"
              >
                İletişim
              </a>
            </nav>

            {/* WhatsApp CTA Button */}
            <a
              href={whatsappUrlWithMessageMain}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden"
              onClick={closeMobileMenu}
            />
          )}
          
          {/* Mobile Menu Dropdown */}
          <div
            className={`md:hidden fixed top-20 left-0 right-0 bg-[#181818] shadow-2xl z-[60] overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <nav className="pt-4 pb-6 border-t border-[#D8CFC4]/20">
              <div className="flex flex-col space-y-4">
                <a
                  href="/#hizmetler"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Hizmetler
                </a>
                <a
                  href="/#galeri"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Galeri
                </a>
                <a
                  href="/#yorumlar"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Yorumlar
                </a>
                <a
                  href="/fiyatlar"
                  onClick={closeMobileMenu}
                  className="text-[#D8CFC4] font-semibold transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  Fiyatlarımız
                </a>
                <a
                  href="/#iletisim"
                  onClick={closeMobileMenu}
                  className="text-[#CFC7BC] hover:text-[#D8CFC4] transition-colors font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#1F1F1F]"
                >
                  İletişim
                </a>
                <a
                  href={whatsappUrlWithMessageMain}
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

      {/* Header Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#181818]">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F5F3EF] mb-6 text-center tracking-tight">
            Fiyatlarımız
          </h1>
          <p className="text-lg sm:text-xl text-[#CFC7BC] text-center leading-relaxed mb-4 max-w-3xl mx-auto">
            Profesyonel kadın kuaför hizmetlerimizin fiyat listesi. Saç tipinize ve ihtiyacınıza
            göre kişiye özel çözümler sunuyoruz.
          </p>
          <div className="bg-[#1F1F1F]/50 backdrop-blur-sm rounded-xl p-4 border border-[#D8CFC4]/10 max-w-3xl mx-auto">
            <p className="text-sm text-[#CFC7BC] leading-relaxed">
              <strong className="text-[#D8CFC4]">Not:</strong> Fiyatlar bilgilendirme amaçlıdır.
              Saç uzunluğu/yoğunluğu ve uygulanacak tekniğe göre değişiklik gösterebilir. Kesin
              fiyat için ücretsiz danışmanlık alabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Prices List */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-3">
            {categories.map((category) => {
              const items = data.categories[category] || [];
              const isOpen = openCategories.has(category);

              return (
                <div
                  key={category}
                  ref={(el) => {
                    categoryRefs.current[category] = el;
                  }}
                  className="bg-[#181818] rounded-2xl border border-[#D8CFC4]/12 overflow-hidden scroll-mt-24"
                >
                  {/* Category Header - Clickable on mobile */}
                  <button
                    onPointerDown={(e) => {
                      // Prevent focus scroll on mobile
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        e.preventDefault();
                      }
                    }}
                    onClick={() => toggleCategory(category)}
                    className="w-full md:pointer-events-none flex items-center justify-between p-4 md:p-6 bg-[#1F1F1F]/30 hover:bg-[#1F1F1F]/50 transition-colors"
                  >
                    <h2 className="text-2xl font-bold text-[#F5F3EF]">{category}</h2>
                    <svg
                      className={`w-6 h-6 text-[#D8CFC4] transition-transform md:hidden ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Category Items */}
                  <div
                    className={`transition-all duration-300 ${
                      isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    } md:max-h-[5000px] md:opacity-100`}
                  >
                    <div className="p-4 md:p-6 space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-[#1F1F1F] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors border border-[#D8CFC4]/5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-1">
                                {item.hizmet}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm text-[#CFC7BC]">
                                {item.sure && (
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
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
                                    {item.sure}
                                  </span>
                                )}
                                {item.not && (
                                  <span className="text-[#D8CFC4]/70 italic">{item.not}</span>
                                )}
                              </div>
                            </div>
                            {item.fiyat && (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-[#D8CFC4] tabular-nums">
                                  {item.fiyat}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#181818]">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-[#1F1F1F] rounded-2xl p-8 border border-[#D8CFC4]/12 text-center">
            <h2 className="text-2xl font-bold text-[#F5F3EF] mb-4">
              Kesin Fiyat İçin İletişime Geçin
            </h2>
            <p className="text-[#CFC7BC] mb-6">
              Saç tipinize ve ihtiyacınıza göre kişiye özel fiyat teklifi için bize ulaşın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrlWithMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp ile Fiyat Sor
              </a>
              <a
                href={phoneLink}
                className="inline-flex items-center justify-center gap-2 bg-[#D8CFC4] hover:bg-[#C4B5A8] text-[#0E0E0E] px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Ara
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
