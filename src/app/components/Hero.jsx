'use client';
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

const CounterItem = ({ value, suffix = '', label, prefix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  
  useEffect(() => {
    AOS.init();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  const animateCount = () => {
    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, 16);
  };
  
  return (
    <div ref={countRef} className="flex flex-col items-center">
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#5b46f6] mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-base md:text-lg text-gray-600">{label}</div>
    </div>
  );
};


const Hero = () => {
  return (
    <>
      <section className="overflow-hidden">
        <div className="flex flex-col h-screen lg:flex-row">
          {/* Text Content - Full width on mobile, half width on desktop */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 w-full  lg:w-1/2 justify-center items-start px-6 py-10 md:py-12 lg:py-0">
            <div data-aos="fade-up" className="text-[#fd8d1e] text-sm md:text-base font-semibold font-inter">
              Join  our crypto exchange
            </div>
            <div data-aos="fade-down" className="max-w-full md:max-w-[623px] text-3xl md:text-5xl lg:text-[64px] font-bold font-inter leading-tight">
              Reliable way to  <span className="ml-3 inline-block" style={{ minWidth: '120px' }}>
                {[' Invest', ' Trade', ' Stake'].map((word, index) => (
                  <span 
                    key={index} 
                    className={`   text-[#fd8d1e] transition-opacity duration-500 ${
                      index === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                    id={`type-${index}`}
                    style={{
                      animation: `typeAnimation 6s infinite ${index * 2}s`
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span> your crypto.
              <style jsx>{`
                @keyframes typeAnimation {
                  0%, 16.66% { opacity: 1; }
                  33.33%, 100% { opacity: 0; }
                }
              `}</style>
            </div>
            <div data-aos="fade-up" className="max-w-full md:max-w-[455px]">
              <span className="text-[#848484] text-base md:text-lg font-normal font-['Inter'] leading-relaxed md:leading-[30px]">
                Coin{" "}
              </span>
              <span className="text-[#5643eb] text-base md:text-lg font-normal font-['Inter'] leading-relaxed md:leading-[30px]">
                ease
              </span>
              <span className="text-[#848484] text-base md:text-lg font-normal font-inter leading-relaxed md:leading-[30px]">
                {" "}
                crypto is the community-run platform powering the cryptocurrency,
                ether and thousands of decentralized applications.
              </span>
            </div>
            
            {/* Email Form - Responsive */}
            <div data-aos="fade-right" className="w-full max-w-[525px] h-[95px] relative">
              <form className="w-full h-full flex items-center">
                <div className="w-full h-[95px] left-0 top-0 absolute bg-white rounded-[14px] shadow-[0px_35px_55px_-12px_rgba(57,49,117,0.10)]" />
                <input 
                  type="email" 
                  placeholder="Enter your mail" 
                  className="absolute left-[15px] md:left-[30px] w-[55%] md:w-[280px] h-[65px] px-[15px] md:px-[30px] text-[#848484] text-base md:text-xl font-normal font-inter outline-none bg-transparent"
                  required
                />
                <button 
                  type="submit" 
                  className="w-[35%] md:w-40 h-[65px] absolute right-[15px] md:left-[335px] top-[15px] bg-[#5b46f6] rounded-xl text-center text-[#fefcfe] text-sm md:text-lg font-normal font-inter"
                >
                  Try now
                </button>
              </form>
            </div>
          </div>
          
          {/* Image Section - Full width on mobile, half width on desktop */}
          <div className="flex justify-center lg:justify-between items-center lg:bg-[#5B46F6] w-full lg:w-1/2 py-10 lg:py-0">
            {/* Main image - always visible */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
              {/* Only show the first image on mobile */}
              <div className="block lg:hidden w-full h-full relative">
                <Image 
                  src="/HeroImg1.png" 
                  alt="hero" 
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
              
              {/* Show both images on desktop */}
              <div className="hidden lg:flex w-full h-full justify-between items-center">
                <Image 
                  src="/HeroImg1.png" 
                  alt="hero" 
                  width={500} 
                  height={500}
                  priority
                />
                <Image 
                  src="/HeroImg3.png" 
                  alt="hero" 
                  width={250} 
                  height={250}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Counter Section - Responsive */}
      <section  data-aos="zoom-in-up" className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto md:mx-10 lg:mx-20 p-6 md:p-10 rounded-2xl bg-linear-to-r from-white to-blue-500 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 text-center">
            <CounterItem value={50} suffix="k+" label="Active Users" />
            <CounterItem value={1.3} suffix="M+" prefix="$" label="Assets Under Management" />
            <CounterItem value={96} suffix="%" label="Customer Satisfaction" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
