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
    <section className="testimonials">
      <h2 className="section-title">#TESTIMONI</h2>
      <p className="testimonials-subtitle">Apa kata klien premium kami</p>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-item">
            <p>"{testimonial.quote}"</p>
            <div className="testimonial-author">{testimonial.author}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
