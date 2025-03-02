import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Testimonials() {
  useEffect(() => {
    AOS.init();
  }, []);

  const testimonials = [
    {
      name: "Alejandro Nicolas",
      location: "Ingenieria, Argentina",
      image: "/user1.png",
      title: "All your crypto in one place",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.",
    },
    {
      name: "Alejandro Nicolas",
      location: "Ingenieria, Argentina",
      image: "/user2.png",
      title: "All your crypto in one place",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.",
    },
    // Add a third testimonial for better demonstration
    {
      name: "Maria Rodriguez",
      location: "Tech Solutions, Brazil",
      image: "/user1.png", // Using existing image as placeholder
      title: "Simplified my workflow",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextTestimonial = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevTestimonial = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section data-aos="zoom-out" className="mx-4 sm:mx-12 my-4 sm:p-20">
      <div className="w-full h-full bg-[#5b46f6] p-6 rounded-[40px]">
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-4 sm:px-34">
            <div className="text-white text-[24px] sm:text-[42px] font-bold font-inter leading-[30px] sm:leading-[50px]">
              What our customers say
            </div>
            <div data-svg-wrapper className="hidden sm:block">
              <svg
                width="176"
                height="149"
                viewBox="0 0 176 149"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.1"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.771866 125.729C27.0171 112.8 40.1395 97.6096 40.1395 80.1562C28.953 78.8633 19.7028 74.2846 12.3885 66.4197C5.0743 58.5549 1.41725 49.4512 1.41725 39.1085C1.41725 28.1193 4.96675 18.854 12.0659 11.3124C19.165 3.77075 28.0925 0 38.8488 0C50.8958 0 61.3292 4.90198 70.1493 14.7061C78.9694 24.5102 83.3794 36.415 83.3794 50.4208C83.3794 92.4384 59.9312 125.298 13.0339 149L0.771866 125.729ZM93.3924 125.729C119.853 112.8 133.083 97.6096 133.083 80.1562C121.681 78.8633 112.323 74.2846 105.009 66.4197C97.6949 58.5549 94.0378 49.4512 94.0378 39.1085C94.0378 28.1193 97.6411 18.854 104.848 11.3124C112.054 3.77075 121.036 0 131.792 0C143.839 0 154.219 4.90198 162.931 14.7061C171.644 24.5102 176 36.415 176 50.4208C176 92.4384 152.659 125.298 105.977 149L93.3924 125.729Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          
          {/* Testimonial carousel with navigation arrows */}
          <div className="relative w-full">
            {/* Previous button */}
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 -ml-2 sm:ml-2"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Testimonial content */}
            <div className="flex justify-center items-center py-8 px-4 sm:px-12">
              <div 
                className={`w-full max-w-lg flex flex-col p-6 sm:p-10 gap-6 sm:gap-10 justify-between items-center bg-white rounded-[10px] transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="flex justify-center items-center gap-5">
                  <div
                    className="w-16 h-16 bg-cover bg-center rounded-full border border-white"
                    style={{ backgroundImage: `url(${testimonials[currentIndex].image})` }}
                  />
                  <div>
                    <div className="text-[#1d2d3f] text-lg font-bold font-exo leading-7">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-[#848484] text-sm font-normal font-exo leading-normal">
                      {testimonials[currentIndex].location}
                    </div>
                  </div>
                </div>
                <div className="text-center text-[#1d2d3f] text-[18px] sm:text-[22px] font-semibold font-inter">
                  {testimonials[currentIndex].title}
                </div>
                <div className="text-center text-[#1d2d3f] text-[16px] sm:text-[18px] font-normal font-inter leading-6">
                  {testimonials[currentIndex].text}
                </div>
              </div>
            </div>
            
            {/* Next button */}
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 -mr-2 sm:mr-2"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Indicator dots */}
          <div className="flex justify-center items-center gap-2 pb-4">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
