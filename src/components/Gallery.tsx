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
    <section id="gallery" className="gallery">
      <h2 className="section-title">GALERI</h2>
      <div className="gallery-grid">
        {galleryImages.map((image, index) => (
          <a key={index} href={image.src} data-fancybox="gallery">
            <img src={image.src} alt={image.alt} />
          </a>
        ))}
      </div>
    </section>
  );
}
