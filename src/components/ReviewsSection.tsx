export default function ReviewsSection() {
  return (
    <section id="yorumlar" className="bg-[#181818] px-4 py-20 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl rounded-3xl border border-[#D8CFC4]/15 p-8 sm:p-12">
        <h2 className="text-3xl font-bold text-[#F5F3EF] sm:text-4xl">Misafirlerimizin deneyimleri</h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-[#CFC7BC]">
          Salonumuzla ilgili güncel değerlendirmeleri ve misafirlerimizin paylaştığı deneyimleri Google işletme profilimizden okuyabilirsiniz.
        </p>
        <a href="https://www.google.com/maps?cid=13836269887033843071" target="_blank" rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#D8CFC4] px-6 py-3 font-medium text-[#0E0E0E] transition-colors hover:bg-[#EFE9E2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8CFC4]">
          Google yorumlarını oku <span aria-hidden="true" className="ml-2">↗</span>
        </a>
      </div>
    </section>
  );
}
