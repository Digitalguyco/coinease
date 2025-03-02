import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#f3f5f6] text-black items-center justify-center flex px-4 sm:px-6">
        <div className="container flex flex-col justify-between py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
              {/* Logo and description */}
              <div className="flex flex-col gap-4 max-w-full md:max-w-[214px]">
                <div className="text-center md:text-left">
                  <span className="text-[#000001] text-xl sm:text-[22px] font-bold font-['Exo'] leading-snug"> </span>
                  <span className="text-[#1d2d3f] text-xl sm:text-[22px] font-bold font-['Exo'] leading-snug">Coin</span>
                  <span className="text-[#5b46f6] text-xl sm:text-[22px] font-bold font-['Exo'] leading-snug">Ease</span>
                </div>
                <div className="text-[#7b838f] text-sm sm:text-base font-normal font-['Inter'] leading-relaxed text-center md:text-left">
                  Through many of its unique properties, Bitcoin allows exciting uses that could not be covered by any previous payment system.
                </div>
              </div>

              {/* Important Links */}
              <div className="flex flex-col gap-4 md:ml-4">
                <div className="text-center md:text-left">
                  <span className="text-[#2c4569] text-lg sm:text-[22px] font-semibold font-['Inter']">I</span>
                  <span className="text-[#2c4569] text-lg sm:text-[22px] font-semibold font-['Inter'] lowercase">MPORTANT LINKS</span>
                </div>
                <ul className="flex flex-col gap-2 text-center md:text-left">
                  <li className="hover:text-[#5b46f6] cursor-pointer">About Us</li>
                  <li className="hover:text-[#5b46f6] cursor-pointer">Plans</li>
                  <li className="hover:text-[#5b46f6] cursor-pointer">Contact Us</li>
                  <li className="hover:text-[#5b46f6] cursor-pointer">Get Started</li>
                </ul>
              </div>

              {/* Account links */}
              <div className="flex flex-col gap-4">
                <div className="text-center md:text-left text-[#2c4569] text-lg sm:text-[22px] font-semibold font-['Inter']">
                  Account
                </div>
                <ul className="flex flex-col gap-2 text-center md:text-left">
                  <li className="hover:text-[#5b46f6] cursor-pointer">Register</li>
                  <li className="hover:text-[#5b46f6] cursor-pointer">Login</li>
                  <li className="hover:text-[#5b46f6] cursor-pointer">Forgot Password</li>
                </ul>
              </div>

              {/* Get in Touch */}
              <div className="flex flex-col gap-4 md:ml-auto">
                <div className="text-[#2c4569] text-lg sm:text-[22px] font-semibold font-['Inter'] text-center md:text-left">
                  Get in Touch
                </div>
                <div className="text-[#7b838f] text-sm sm:text-base font-normal font-['Inter'] leading-relaxed text-center md:text-left max-w-full md:max-w-[314px]">
                  Question or feedback? We'd love to hear from you.
                </div>
                <form className="flex flex-col gap-2 w-full max-w-[314px] mx-auto md:mx-0">
                  <input 
                    className="w-full h-[45px] sm:h-[55px] px-4 rounded-lg border border-black" 
                    type="text" 
                    id="email" 
                    name="email" 
                    placeholder="Enter your email" 
                  />
                  <button className="w-full sm:w-[150px] self-center sm:self-start h-[45px] sm:h-[55px] bg-[#468cf6] text-white rounded-lg hover:bg-[#3a7de0] transition-colors duration-300">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
            
            {/* Copyright and Policy */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-10 gap-4 sm:gap-0 border-t border-gray-200 mt-8">
              <div className="text-[#7b838f] text-sm sm:text-base font-normal font-['Inter'] leading-relaxed order-2 sm:order-1">
                Copyright © CoineEase 2025
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 order-1 sm:order-2">
                <div className="text-[#7b838f] text-sm sm:text-base font-normal font-['Inter'] leading-relaxed hover:text-[#5b46f6] cursor-pointer">
                  Privacy Policy
                </div>
                <div className="text-[#7b838f] text-sm sm:text-base font-normal font-['Inter'] leading-relaxed hover:text-[#5b46f6] cursor-pointer">
                  Terms & Conditions
                </div>
              </div>
            </div>
        </div>
    </footer>
  )
}
