import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Excellence from "@/components/Excellence";
import Treatments from "@/components/Treatments";
import ProblemSolution from "@/components/ProblemSolution";
import Gallery from "@/components/Gallery";
import Society from "@/components/Society";
import Values from "@/components/Values";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Excellence />
      <Treatments />
      <ProblemSolution />
      <Gallery />
      <Society />
      <Values />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
