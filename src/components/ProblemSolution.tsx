import Link from 'next/link';

export default function ProblemSolution() {
  const skinProblems = [
    'Kulit wajah mulai kendur dan kehilangan elastisitas',
    'Garis halus dan kerutan mulai terlihat jelas',
    'Pipi mulai turun dan kontur wajah tidak tegas',
    'Kulit leher kendur dan muncul double chin',
    'Pori-pori membesar dan tekstur kulit tidak rata',
    'Ingin tampil awet muda tanpa operasi'
  ];

  return (
    <section className="py-20 px-5 bg-gradient-to-b from-black via-dark/50 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Hook CTA */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Apakah Anda Mengalami Masalah Ini?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            {skinProblems.map((problem, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 text-left bg-dark/50 border border-red-500/30 p-4 rounded-lg"
              >
                <span className="text-red-400 text-xl mt-0.5">✗</span>
                <span className="text-white/80 text-sm">{problem}</span>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="text-6xl mb-6">✨</div>
            
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
              HIFU Ultraformer MPT
            </h3>
            
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              Solusi Non-Invasif untuk Kulit Kencang & Awet Muda
            </p>
            
            <p className="text-base text-white/70 mb-8 leading-relaxed max-w-2xl mx-auto">
              Teknologi HIFU (High-Intensity Focused Ultrasound) adalah perawatan revolusioner untuk 
              mengencangkan kulit dan mengurangi tanda-tanda penuaan tanpa operasi, tanpa jarum, 
              dan tanpa downtime.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔬</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Tanpa Operasi</h4>
                <p className="text-sm text-white/60">Non-invasif & aman</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Hasil Natural</h4>
                <p className="text-sm text-white/60">Terlihat alami & bertahap</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Tanpa Downtime</h4>
                <p className="text-sm text-white/60">Langsung aktivitas</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/treatments#hifu"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-light text-dark px-8 py-4 rounded-lg font-bold text-base hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <span>Lihat Detail HIFU Treatment</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              
              <Link 
                href="/treatments"
                className="inline-block bg-transparent border-2 border-primary/50 text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto text-center"
              >
                Lihat Semua Perawatan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
