// Shared public contact information for all website entry points.
export const phoneDisplay = '0542 557 40 82';
export const phoneLink = 'tel:+905425574082';
export const whatsappUrl = 'https://wa.me/905425574082';
export const bookingUrl = whatsappUrl + '?text=' + encodeURIComponent('Merhaba, Lumina Hair Studio için randevu almak istiyorum.');
export const streetAddress = 'İnönü Mahallesi, 1401. Sokak, İnci Apartmanı No: 9, Daire: 4';
export const fullAddress = streetAddress + ', 33130 Yenişehir/Mersin';
export const locationUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(fullAddress);
export const mapEmbedUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(fullAddress) + '&output=embed';
