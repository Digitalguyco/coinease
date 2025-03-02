'use client';
import { useEffect } from 'react';
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import MobilePhone from "./components/MobilePhone";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.livecoinwatch.com/static/lcw-widget.js";
    script.defer = true;
    script.onload = () => {
      // Initialize the widget if needed
      // You might need to call a specific function here if the widget requires it
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script if necessary
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div className="overflow-x-hidden">
        <div className="livecoinwatch-widget-5" lcw-base="USD" lcw-color-tx="#999999" lcw-marquee-1="coins" lcw-marquee-2="movers" lcw-marquee-items="10"></div>

        <Header />
        <div id="hero">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <div id="mobile">
          <MobilePhone />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  );
}
