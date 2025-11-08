import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import LoanProducts from "@/components/LoanProducts";
import Calculator from "@/components/Calculator";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import News from "@/components/News";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <LoanProducts />
      <Calculator />
      <Process />
      <Testimonials />
      <News />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
