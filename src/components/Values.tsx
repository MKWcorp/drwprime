export default function Values() {
  const values = [
    {
      title: "Elegance",
      description: "Setiap detail dirancang dengan kemewahan dan keanggunan"
    },
    {
      title: "Empowerment", 
      description: "Memberdayakan wanita untuk percaya diri dengan kecantikan alami"
    },
    {
      title: "Excellence",
      description: "Standar kualitas tinggi dalam setiap layanan dan perawatan"
    },
    {
      title: "Koneksi Personal",
      description: "Hubungan yang mendalam dan personal dengan setiap klien"
    },
    {
      title: "Kualitas Hidup",
      description: "Meningkatkan kualitas hidup melalui perawatan holistik"
    }
  ];

  return (
    <section className="py-20 px-5 bg-dark/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          NILAI & KEUNGGULAN KAMI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-primary mb-3 font-playfair">
                {value.title}
              </h3>
              <p className="text-white/60">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
