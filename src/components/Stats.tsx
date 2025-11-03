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
    <section className="py-20 px-5 bg-dark/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-playfair">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-white/60 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
