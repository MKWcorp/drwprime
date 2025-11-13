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
    <section id="gallery" className="py-20 bg-dark/50">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          GALERI
        </h2>
        
        {/* Grid Gallery - 3 Rows */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="w-full aspect-square relative group cursor-pointer"
            >
              {/* Gold Circle Frame */}
              <div className="absolute inset-0 rounded-full border-4 border-primary shadow-lg shadow-primary/30 z-10 group-hover:scale-105 transition-transform duration-300" />
              
              {/* Image Container */}
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
