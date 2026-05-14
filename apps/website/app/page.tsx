import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { WidgetDemo } from "@/components/WidgetDemo";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <WidgetDemo />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}
