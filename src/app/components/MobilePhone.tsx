import React, { useEffect } from 'react'
import Image from 'next/image'
import AOS from "aos";
import "aos/dist/aos.css";

export default function MobilePhone() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <section data-aos="zoom-in" className="mx-4 sm:mx-8 md:mx-12 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-10 justify-center md:justify-around container">
        <div className="flex flex-col gap-6 md:gap-10 max-w-full md:max-w-[505px]">
          <div className="text-[28px] sm:text-[36px] md:text-[42px] font-bold font-inter leading-tight md:leading-[50px]">
            The Easiest and Most Powerful Mobile Crypto Trading App
          </div>
          <div className="text-[#848484] text-sm sm:text-base font-normal font-inter leading-relaxed max-w-full md:max-w-[455px]">
            Download our mobile app and start trading crypto on the go, with a user-friendly interface and advanced features like real-time market data, secure transactions, and customizable alerts.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <div className="px-4 sm:px-6 py-3 gap-3 sm:gap-4 border border-[#468cf6] hover:bg-[#468cf6] rounded-lg flex items-center justify-center sm:justify-around transition-colors duration-300">
              <div className="text-sm sm:text-base font-normal font-inter leading-relaxed">
                Download iOS app
              </div>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1.5rem" width="1.5rem" xmlns="http://www.w3.org/2000/svg"><path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path></svg>
            </div>
            <div className="px-4 sm:px-6 py-3 border border-[#468cf6] hover:bg-[#468cf6] rounded-lg flex items-center gap-3 sm:gap-4 justify-center sm:justify-around transition-colors duration-300">
              <div className="text-sm sm:text-base font-normal font-inter leading-relaxed whitespace-nowrap">
                Download Android app
              </div>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.5rem" width="1.5rem" xmlns="http://www.w3.org/2000/svg"><path d="M48 59.49v393a4.33 4.33 0 007.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0048 59.49zM345.8 174L89.22 32.64l-.16-.09c-4.42-2.4-8.62 3.58-5 7.06l201.13 192.32zM84.08 472.39c-3.64 3.48.56 9.46 5 7.06l.16-.09L345.8 338l-60.61-57.95zM449.38 231l-71.65-39.46L310.36 256l67.37 64.43L449.38 281c19.49-10.77 19.49-39.23 0-50z"></path></svg>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8 md:mt-0">
          <Image 
            src="/phone.png" 
            alt="Mobile app screenshot" 
            width={500} 
            height={500}
            className="w-[280px] animate-float  sm:w-[400px] md:w-[500px] h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}
