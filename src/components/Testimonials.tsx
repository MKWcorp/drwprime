export default function Testimonials() {
  const testimonials = [
    {
      quote: "Kecantikan bukan sekadar tampilan luar, tapi seni yang abadi. DRW Prime benar-benar memahami ini.",
      author: "Andini - Brand Manager"
    },
    {
      quote: "Setiap perawatan adalah investasi untuk versi terbaik diri saya. Hasilnya beyond expectation!",
      author: "Citra - Notaris"
    },
    {
      quote: "Prime Society memberikan pengalaman yang tidak akan saya dapatkan di klinik lain. Truly premium!",
      author: "Sarah - Entrepreneur"
    }
  ];

  return (
    <section className="py-20 px-5 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary text-center mb-4">
          #TESTIMONI
        </h2>
        <p className="text-lg text-white/60 text-center mb-12">
          Apa kata klien premium kami
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-dark/50 border border-primary/20 p-8 rounded-lg hover:border-primary/50 transition-all duration-300"
            >
              <p className="text-white/70 text-base leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="text-primary font-semibold text-sm">
                {testimonial.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
