import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import HomeTreatmentGrid from "@/components/HomeTreatmentGrid";
// import Stats from "@/components/Stats";
// import Excellence from "@/components/Excellence";
// import ProblemSolution from "@/components/ProblemSolution";
import Gallery from "@/components/Gallery";
import Society from "@/components/Society";
// import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <BentoGrid />
      <HomeTreatmentGrid />
      {/* <Stats /> */}
      {/* <Excellence /> */}
      {/* <ProblemSolution /> */}
      <Gallery />
      <Society />
      {/* <Testimonials /> */}
      <Contact />
      <Footer />
    </main>
  );
}
