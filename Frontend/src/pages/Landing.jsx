import React from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
export default function Landing() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
