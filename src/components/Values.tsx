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
    <section className="values">
      <h2 className="section-title">NILAI & KEUNGGULAN KAMI</h2>
      <div className="values-grid">
        {values.map((value, index) => (
          <div key={index} className="value-item">
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
