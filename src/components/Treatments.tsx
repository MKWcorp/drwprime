export default function Treatments() {
  const treatments = [
    {
      title: "ULTRA FORMER MPT",
      description: "Teknologi HIFU terbaru untuk mengencangkan dan meremajakan kulit wajah tanpa operasi"
    },
    {
      title: "OXY TREATMENT", 
      description: "Perawatan oksigen untuk mencerahkan dan merevitalisasi kulit kusam"
    },
    {
      title: "PRIME FACIAL",
      description: "Facial premium dengan teknik advance dan produk berkualitas tinggi"
    },
    {
      title: "CONTOURING TREATMENT",
      description: "Membentuk dan mengencangkan kontur wajah untuk tampilan yang lebih defined"
    }
  ];

  return (
    <section id="treatments" className="py-20 px-5 bg-dark/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          TREATMENT PREMIUM
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatments.map((treatment, index) => (
            <div 
              key={index} 
              className="bg-black/50 border border-primary/20 p-6 rounded-lg hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-primary mb-3 font-playfair">
                {treatment.title}
              </h3>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                {treatment.description}
              </p>
              <a 
                href="/treatments" 
                className="inline-block text-sm text-primary hover:text-primary-light transition-colors duration-300 font-semibold"
              >
                Discover More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
