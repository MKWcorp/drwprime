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
    <section id="treatments" className="treatments">
      <h2 className="section-title">TREATMENT PREMIUM</h2>
      <div className="treatments-grid">
        {treatments.map((treatment, index) => (
          <div key={index} className="treatment-card">
            <h3>{treatment.title}</h3>
            <p>{treatment.description}</p>
            <a href="#" className="btn-discover">Discover More</a>
          </div>
        ))}
      </div>
    </section>
  );
}
