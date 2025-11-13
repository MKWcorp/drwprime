import Image from 'next/image';

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

          {/* HIFU Image Only */}
          <div className="max-w-5xl mx-auto">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-2xl">
              <Image 
                src="/ultraformermpt.png"
                alt="HIFU Ultraformer MPT"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
