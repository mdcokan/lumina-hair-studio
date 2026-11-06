import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { bookingUrl, whatsappUrl, phoneLink, phoneDisplay } from '@/src/content/contact';

export const metadata: Metadata = {
  title: 'Hizmetler ve Fiyat Bilgisi | Lumina Hair Studio',
  description: 'Saç kesimi, renklendirme, ombre, balyaj ve bakım için Lumina Hair Studio ile WhatsApp üzerinden fiyat bilgisi alın.',
};
const services = [
  ['Kesim & Stil', 'Saç tipinize ve yüz hatlarınıza uygun bir kesimi birlikte planlayalım.', '/services/service-1.jpg'],
  ['Boyama & Balyaj', 'Ombre, balyaj ve renklendirme için istediğiniz görünümü bizimle paylaşın.', '/services/service-2.jpg'],
  ['Saç Bakımı', 'Saçınızın ihtiyacına uygun bakım seçeneklerini öğrenin.', '/services/service-3.jpg'],
  ['Fön & Şekillendirme', 'Günlük stiliniz veya özel gününüz için bize ulaşın.', '/services/service-4.jpg'],
  ['Keratin Bakımı', 'Saçınızın uzunluğuna ve yapısına uygun uygulama bilgisi alın.', '/services/service-5.jpg'],
  ['Özel Gün Hazırlığı', 'Düğün, nişan ve özel gün hazırlığınızı birlikte planlayalım.', '/services/service-6.jpg'],
];

export default function PricesPage() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F5F3EF]">
      <header className="border-b border-[#D8CFC4]/15 bg-[#171411]">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-xl sm:text-2xl font-semibold text-[#D8CFC4]">Lumina Hair Studio</Link>
          <Link href="/" className="text-sm text-[#CFC7BC] hover:text-white">← Ana sayfa</Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:pt-20 pb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#D8CFC4]">Size özel bakım, size özel plan</p>
        <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight">Hizmetler ve fiyat bilgisi</h1>
        <p className="mt-6 max-w-2xl text-lg text-[#CFC7BC]">Uygulama ücreti; saçınızın uzunluğu, mevcut durumu ve istediğiniz işleme göre değişebilir. Güncel fiyat bilgisi ve randevu için WhatsApp üzerinden bizimle iletişime geçin.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#D8CFC4] px-6 py-3.5 text-center font-semibold text-[#171411] hover:bg-[#EFE9E2]">WhatsApp ile randevu al</a>
          <a href={phoneLink} className="rounded-full border border-[#D8CFC4]/30 px-6 py-3.5 text-center text-[#D8CFC4]">{phoneDisplay}</a>
        </div>
      </section>
      <section aria-label="Hizmetlerimiz" className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 pb-16">
        {services.map(([title, description, image]) => (
          <article key={title} className="overflow-hidden rounded-3xl border border-[#D8CFC4]/15 bg-[#181818]">
            <div className="relative aspect-[4/3]"><Image src={image} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-[#CFC7BC]">{description}</p>
              <a href={whatsappUrl + '?text=' + encodeURIComponent('Merhaba, ' + title + ' için fiyat bilgisi almak istiyorum.')} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center font-medium text-[#D8CFC4] hover:text-white">WhatsApp’tan fiyat sor ↗</a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
