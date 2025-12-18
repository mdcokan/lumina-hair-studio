'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phoneDisplay = '0 552 380 36 96';
  const phoneLink = 'tel:+905523803696';
  const whatsappUrl = 'https://wa.me/905523803696';
  const whatsappMessage = encodeURIComponent('Merhaba, randevu almak istiyorum.');
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${whatsappMessage}`;
  const locationUrl = 'https://www.google.com/maps/place/Yenişehir,+Mersin';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8ff] via-[#fff5f9] to-white">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#e8e0f5]/50'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#7C6AE6] to-[#E8B4D9] bg-clip-text text-transparent tracking-tight">
                Lumina Hair Studio
              </h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#hizmetler"
                className="text-[#4a4a4a] hover:text-[#7C6AE6] transition-all duration-500 font-medium"
              >
                Hizmetler
              </a>
              <a
                href="#galeri"
                className="text-[#4a4a4a] hover:text-[#7C6AE6] transition-all duration-500 font-medium"
              >
                Galeri
              </a>
              <a
                href="#yorumlar"
                className="text-[#4a4a4a] hover:text-[#7C6AE6] transition-all duration-500 font-medium"
              >
                Yorumlar
              </a>
              <a
                href="#iletisim"
                className="text-[#4a4a4a] hover:text-[#7C6AE6] transition-all duration-500 font-medium"
              >
                İletişim
              </a>
            </nav>

            {/* WhatsApp CTA Button */}
            <a
              href={whatsappUrlWithMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#7C6AE6] hover:bg-[#6B5AD6] text-white px-5 py-2.5 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[#7C6AE6]/30"
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
            <button className="md:hidden text-[#4a4a4a] hover:text-[#7C6AE6] transition-colors duration-500">
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
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#faf8ff] via-[#fff5f9] to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2d2d2d] mb-8 leading-tight tracking-tight">
              Saçlarınızın Işıltısı,
              <br />
              <span className="bg-gradient-to-r from-[#7C6AE6] to-[#E8B4D9] bg-clip-text text-transparent">
                Güzelliğiniz
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-[#6b6b6b] mb-12 leading-relaxed">
              Yenişehir/Mersin'de premium saç bakım hizmetleri. Uzman ekibimizle
              hayalinizdeki saça kavuşun.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-[#e8e0f5]">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-[#4a4a4a]">Google 5.0 ★</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappUrlWithMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#7C6AE6] hover:bg-[#6B5AD6] text-white px-10 py-5 rounded-full font-semibold text-lg transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#7C6AE6]/30 transform hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Randevu Al (WhatsApp)
              </a>
              <a
                href="#iletisim"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-[#faf8ff] text-[#2d2d2d] px-10 py-5 rounded-full font-semibold text-lg transition-all duration-500 shadow-xl hover:shadow-2xl border-2 border-[#e8e0f5] hover:border-[#7C6AE6]/30"
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
                Yol Tarifi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="hizmetler" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2d2d] mb-6 tracking-tight">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed">
              Profesyonel ekibimizle sunduğumuz kapsamlı saç bakım ve stil hizmetleri
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Kesim & Stil',
                description: 'Modern ve klasik kesim teknikleri ile hayalinizdeki görünüme kavuşun.',
                icon: '✂️',
              },
              {
                title: 'Boyama & Balayage',
                description: 'Profesyonel boyama teknikleri ile saçlarınıza yeni bir ışıltı katın.',
                icon: '🎨',
              },
              {
                title: 'Saç Bakımı',
                description: 'Derinlemesine bakım tedavileri ile saçlarınızı güçlendirin.',
                icon: '💆',
              },
              {
                title: 'Fön & Şekillendirme',
                description: 'Özel günleriniz için profesyonel fön ve şekillendirme hizmetleri.',
                icon: '✨',
              },
              {
                title: 'Keratin Bakımı',
                description: 'Düzleştirme ve yumuşatma için premium keratin tedavileri.',
                icon: '🌟',
              },
              {
                title: 'Özel Paketler',
                description: 'Düğün, nişan ve özel günler için özel paket hizmetlerimiz.',
                icon: '💐',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 lg:p-10 rounded-[24px] hover:shadow-[0_8px_30px_rgba(124,106,230,0.12)] transition-all duration-500 transform hover:-translate-y-2 border border-[#f0eef8]"
              >
                <div className="text-6xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">
                  {service.title}
                </h3>
                <p className="text-[#6b6b6b] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section id="galeri" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#faf8ff]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2d2d] mb-6 tracking-tight">
              Önce & Sonra
            </h2>
            <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed">
              Müşterilerimizin dönüşüm hikayeleri
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(124,106,230,0.08)] hover:shadow-[0_8px_30px_rgba(124,106,230,0.12)] transition-all duration-500 transform hover:scale-[1.02] group"
              >
                <div className="w-full h-full bg-gradient-to-br from-[#D4C5F4] via-[#E8B4D9] to-[#D4C5F4] flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg
                      className="w-16 h-16 mx-auto text-[#7C6AE6] opacity-40"
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
                    <p className="mt-2 text-sm text-[#7C6AE6] font-medium">
                      Fotoğraf {index + 1}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="yorumlar" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2d2d] mb-6 tracking-tight">
              Müşteri Yorumları
            </h2>
            <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed">
              Memnuniyetimiz en büyük önceliğimiz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
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
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white p-8 lg:p-10 rounded-[24px] shadow-[0_4px_20px_rgba(124,106,230,0.08)] border border-[#f0eef8] hover:shadow-[0_8px_30px_rgba(124,106,230,0.12)] transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#4a4a4a] mb-6 leading-relaxed italic text-lg">
                  "{review.comment}"
                </p>
                <p className="text-[#2d2d2d] font-semibold text-lg">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#7C6AE6]/10 via-[#E8B4D9]/10 to-[#7C6AE6]/10">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2d2d2d] mb-4 tracking-tight">
            Hayalinizdeki Saça Kavuşun
          </h2>
          <p className="text-lg text-[#6b6b6b] mb-8 max-w-2xl mx-auto">
            Profesyonel ekibimizle randevu alın ve saçlarınıza özenle yaklaşalım
          </p>
          <a
            href={whatsappUrlWithMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#7C6AE6] hover:bg-[#6B5AD6] text-white px-10 py-5 rounded-full font-semibold text-lg transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#7C6AE6]/30 transform hover:-translate-y-1"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp ile Randevu Al
          </a>
        </div>
      </section>

      {/* Location & Hours Section */}
      <section id="iletisim" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#faf8ff] via-[#fff5f9] to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2d2d] mb-6 tracking-tight">
              Bize Ulaşın
            </h2>
            <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed">
              Yenişehir/Mersin'de sizleri bekliyoruz
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Address & Hours */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#7C6AE6]"
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
                <p className="text-[#4a4a4a] text-lg leading-relaxed">
                  Yenişehir Mahallesi
                  <br />
                  Örnek Sokak No: 123
                  <br />
                  Mersin, Türkiye
                </p>
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[#7C6AE6] hover:text-[#6B5AD6] font-medium transition-colors duration-500"
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
                <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#7C6AE6]"
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
                <div className="space-y-2 text-[#4a4a4a] text-lg">
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
                <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#7C6AE6]"
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
                <p className="text-[#4a4a4a] text-lg mb-4">
                  <a
                    href={phoneLink}
                    className="hover:text-[#7C6AE6] transition-colors duration-500 font-semibold"
                  >
                    {phoneDisplay}
                  </a>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={phoneLink}
                    className="inline-flex items-center justify-center gap-2 bg-[#7C6AE6] hover:bg-[#6B5AD6] text-white px-6 py-3 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[#7C6AE6]/30"
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
                    className="inline-flex items-center justify-center gap-2 bg-[#7C6AE6] hover:bg-[#6B5AD6] text-white px-6 py-3 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-[#7C6AE6]/30"
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
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(124,106,230,0.08)] h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4C5F4] via-[#E8B4D9] to-[#D4C5F4] flex items-center justify-center">
                <div className="text-center p-8">
                  <svg
                    className="w-24 h-24 mx-auto text-[#7C6AE6] opacity-40 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-[#7C6AE6] font-medium text-lg">
                    Harita Buraya Eklenecek
                  </p>
                  <p className="text-[#7C6AE6]/70 text-sm mt-2">
                    Google Maps embed kodu buraya eklenebilir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#faf8ff] to-white py-12 px-4 sm:px-6 lg:px-8 border-t border-[#e8e0f5]/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#7C6AE6] to-[#E8B4D9] bg-clip-text text-transparent tracking-tight">
                Lumina Hair Studio
              </h3>
              <p className="text-[#6b6b6b] leading-relaxed">
                Yenişehir/Mersin'de premium saç bakım ve stil hizmetleri sunan
                profesyonel kuaför salonu.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#2d2d2d]">Hızlı Linkler</h4>
              <ul className="space-y-2 text-[#6b6b6b]">
                <li>
                  <a
                    href="#hizmetler"
                    className="hover:text-[#7C6AE6] transition-colors duration-500"
                  >
                    Hizmetler
                  </a>
                </li>
                <li>
                  <a
                    href="#galeri"
                    className="hover:text-[#7C6AE6] transition-colors duration-500"
                  >
                    Galeri
                  </a>
                </li>
                <li>
                  <a
                    href="#yorumlar"
                    className="hover:text-[#7C6AE6] transition-colors duration-500"
                  >
                    Yorumlar
                  </a>
                </li>
                <li>
                  <a
                    href="#iletisim"
                    className="hover:text-[#7C6AE6] transition-colors duration-500"
                  >
                    İletişim
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#2d2d2d]">İletişim</h4>
              <ul className="space-y-2 text-[#6b6b6b]">
                <li>
                  <a
                    href={phoneLink}
                    className="hover:text-[#7C6AE6] transition-colors duration-500"
                  >
                    {phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7C6AE6] transition-colors duration-500"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-[#6b6b6b] border-t border-[#e8e0f5]/50">
            <p>&copy; {new Date().getFullYear()} Lumina Hair Studio. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrlWithMessage}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#7C6AE6] hover:bg-[#6B5AD6] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#7C6AE6]/50 transition-all duration-500 transform hover:scale-110"
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
