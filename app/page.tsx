import Hero from "@/components/Hero";
import About from "@/components/About";
import Destinations from "@/components/Destinations";
import TourTypes from "@/components/TourTypes";
import WhyUs from "@/components/WhyUs";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Destinations />
      <TourTypes />
      <WhyUs />
      <Gallery />
      <Contact />
    </>
  );
}
