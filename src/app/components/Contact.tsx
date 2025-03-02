import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";

export default function Contact() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <section data-aos="zoom-in" className="mx-4 sm:mx-8 md:mx-12 my-8 md:my-12">
      <div className="flex justify-center items-center container">
        <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[530px]">
          <div className="text-center text-[28px] sm:text-[36px] md:text-[42px] font-bold font-['Inter'] leading-tight md:leading-[50px]">
            Get in touch
          </div>
          <form action="" className="w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <input 
                  className="w-full h-[45px] sm:h-[55px] dark:bg-black bg-white px-4 rounded-lg border dark:border-white border-black" 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your name" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <input 
                  className="w-full h-[45px] sm:h-[55px] dark:bg-black bg-white px-4 rounded-lg border dark:border-white border-black" 
                  type="text" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <textarea 
                  className="w-full h-[120px] sm:h-[150px] md:h-[180px] dark:bg-black bg-white font-normal font-inter leading-relaxed rounded-lg border dark:border-white border-black p-4 align-top" 
                  id="message" 
                  name="message" 
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button className="w-full h-[45px] sm:h-[55px] bg-[#468cf6] text-white rounded-lg hover:bg-[#3a7de0] transition-colors duration-300">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}