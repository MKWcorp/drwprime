export default function Stats() {
  const stats = [
    { number: "5000+", label: "CLIENT TERPUASKAN" },
    { number: "10", label: "TAHUN PENGALAMAN" },
    { number: "15+", label: "TREATMENT PREMIUM" },
    { number: "200+", label: "PRIME SOCIETY MEMBER" },
    { number: "8", label: "TREATMENT ROOM" },
    { number: "12", label: "EXPERT THERAPIST" }
  ];

  return (
    <section className="stats">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
