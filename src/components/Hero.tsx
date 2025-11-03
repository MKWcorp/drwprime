export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-5 pt-20 bg-gradient-to-b from-black via-dark to-black" id="about">
      <div className="max-w-4xl text-center">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
          The Art of Timeless Beauty
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-6 leading-relaxed">
          Menghadirkan layanan premium berbasis komunitas dengan sentuhan emosional dan estetika yang kuat.
        </p>
        <p className="text-base md:text-lg text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
          DRW Prime adalah klinik kecantikan premium di Yogyakarta yang memadukan teknologi modern, 
          pelayanan personal, dan komunitas eksklusif untuk membantu wanita mencapai kecantikan abadi dengan percaya diri.
        </p>
        <a 
          href="/treatments" 
          className="inline-block bg-gradient-to-r from-primary to-primary-light text-dark px-10 py-4 rounded-lg font-bold text-sm tracking-wider hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
        >
          OUR TREATMENTS
        </a>
      </div>
    </section>
  );
}
