import Link from 'next/link';

export default function ProblemSolution() {
  const solutions = [
    {
      id: 'pico-laser',
      problem: 'Punya masalah bulu yang mengganggu atau flek hitam membandel?',
      solution: 'Pico Laser',
      description: 'Solusi permanen untuk menghilangkan bulu dan mengatasi pigmentasi dengan teknologi laser terkini',
      icon: '⚡',
      benefits: ['Hasil Permanen', 'Tanpa Rasa Sakit', 'Aman & Efektif']
    },
    {
      id: 'hifu',
      problem: 'Kulit wajah mulai kendur dan tampak tanda-tanda penuaan?',
      solution: 'HIFU Ultraformer MPT',
      description: 'Teknologi HIFU untuk mengencangkan kulit dan mengurangi kerutan tanpa operasi',
      icon: '✨',
      benefits: ['Tanpa Operasi', 'Hasil Natural', 'Tanpa Downtime']
    },
    {
      id: 'injection',
      problem: 'Ingin tampil lebih muda dengan hasil yang instant?',
      solution: 'Injection Treatment',
      description: 'Perawatan injection dengan Botox dan Filler untuk hasil anti-aging yang optimal',
      icon: '💉',
      benefits: ['Hasil Instant', 'Prosedur Cepat', 'Tampilan Natural']
    }
  ];

  return (
    <section className="py-20 px-5 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Temukan Solusi untuk Masalah Kecantikan Anda
          </h2>
          <p className="text-lg text-white/70">
            Kami memiliki perawatan yang tepat untuk setiap kebutuhan kecantikan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {solutions.map((item) => (
            <div 
              key={item.id} 
              className="bg-dark/50 border border-primary/20 p-8 rounded-lg hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="text-5xl mb-6 text-center">{item.icon}</div>
              
              <h3 className="text-lg text-white/80 mb-4 leading-relaxed text-center">
                {item.problem}
              </h3>
              
              <div className="mb-4 text-center">
                <span className="text-sm text-primary/70 block mb-2">Solusi:</span>
                <h4 className="text-2xl font-bold text-primary font-playfair">
                  {item.solution}
                </h4>
              </div>
              
              <p className="text-sm text-white/60 mb-6 text-center">
                {item.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {item.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-primary">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <Link 
                href={`/treatments#${item.id}`}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-primary-light text-dark py-3 px-6 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Lihat Detail Perawatan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-white/60 mb-4">Atau lihat semua perawatan kami</p>
          <Link 
            href="/treatments"
            className="inline-block bg-transparent border-2 border-primary text-primary px-10 py-3 rounded-lg font-semibold hover:bg-primary hover:text-dark transition-all duration-300"
          >
            Lihat Semua Perawatan
          </Link>
        </div>
      </div>
    </section>
  );
}
