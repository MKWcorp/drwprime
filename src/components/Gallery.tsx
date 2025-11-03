import Image from 'next/image';

export default function Gallery() {
  const galleryImages = [
    { src: "/drwprime-faceside.png", alt: "Fasad Klinik DRW Prime" },
    { src: "/drwprime-resepsionis.png", alt: "Resepsionis DRW Prime" },
    { src: "/drwprime-loungue.png", alt: "Loungue DRW Prime" },
    { src: "/drwprime-facial-room.png", alt: "Facial Room DRW Prime" },
    { src: "/drwprime-spa.png", alt: "Spa DRW Prime" },
    { src: "/drwprime-consultation-room.png", alt: "Consultation Room DRW Prime" },
    { src: "/drwprime-laser-room.png", alt: "Laser Room DRW Prime" },
    { src: "/drwprime-contouring-room.png", alt: "Contouring Room DRW Prime" },
    { src: "/drwprime-academy-room.png", alt: "Academy Room DRW Prime" },
    { src: "/drwprime-product.png", alt: "Produk DRW Prime" }
  ];

  return (
    <section id="gallery" className="py-20 px-5 bg-dark/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          GALERI
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              <Image 
                src={image.src} 
                alt={image.alt} 
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
