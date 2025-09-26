export default function Society() {
  const benefits = [
    {
      title: "Prime Padel Challenge",
      description: "Event olahraga eksklusif untuk member Prime Society"
    },
    {
      title: "Private Dining",
      description: "Makan malam eksklusif dengan sesama member premium"
    },
    {
      title: "Yoga Session",
      description: "Sesi yoga dan meditasi untuk keseimbangan inner beauty"
    },
    {
      title: "Prime Concert & Staycation",
      description: "Konser musik dan staycation premium di venue eksklusif"
    }
  ];

  return (
    <section id="society" className="society">
      <h2 className="section-title">#COMMUNITY</h2>
      <h3 className="society-subtitle">Prime Society Membership</h3>
      <p className="society-description">
        Bergabunglah dengan komunitas eksklusif Prime Society dan nikmati pengalaman premium yang tak terbatas. 
        Akses prioritas ke event-event eksklusif, discount khusus member, dan treatment package yang dirancang khusus untuk Anda.
      </p>
      <div className="society-features">
        {benefits.map((benefit, index) => (
          <div key={index} className="feature-item">
            <h4>{benefit.title}</h4>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
