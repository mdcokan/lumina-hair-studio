'use client';

export default function MapEmbed() {
  return (
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
  );
}

