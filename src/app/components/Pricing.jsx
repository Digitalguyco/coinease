import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Pricing() {
  const [activePlan, setActivePlan] = useState("starter");

  const togglePlan = (plan) => {
    setActivePlan(plan);
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section data-aos="zoom-out" id="plans" className="px-4 md:px-8 lg:mx-12 py-10 md:py-20 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col justify-center items-center gap-8 md:gap-12">
        {/* Header and Toggle */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 lg:gap-30 w-full">
          <div className="flex flex-col text-center md:text-left mb-4 md:mb-0">
            <div data-aos="fade-up" className="text-2xl md:text-3xl lg:text-[40px] text-[#221c4e] font-normal font-inter">
              Plans & Pricing
            </div>
            <div data-aos="fade-left" className="text-[#848484] text-sm md:text-base lg:text-lg font-medium font-inter max-w-md">
              Whether your time-saving automation needs are large or small,
              we're here to help you scale.
            </div>
          </div>

          {/* Toggle Button */}
          <div className="bg-white/50 rounded-3xl h-11 flex items-center">
            <div 
              className={`px-4 md:px-6 py-[13px] rounded-[22px] cursor-pointer transition-all duration-300 ${
                activePlan === "starter" 
                  ? "bg-[#5b46f6] text-white shadow-[0px_5px_7px_0px_rgba(82,67,194,0.23)]" 
                  : "text-[#5b46f6]"
              }`}
              onClick={() => togglePlan("starter")}
            >
              <div className="text-center text-xs font-medium font-inter tracking-wide">
                STARTER
              </div>
            </div>
            <div 
              className={`px-4 md:px-6 py-[13px] rounded-[22px] cursor-pointer transition-all duration-300 ${
                activePlan === "pro" 
                  ? "bg-[#5b46f6] text-white shadow-[0px_5px_7px_0px_rgba(82,67,194,0.23)]" 
                  : "text-[#5b46f6]"
              }`}
              onClick={() => togglePlan("pro")}
            >
              <div className="text-center text-xs font-medium font-inter tracking-wide">
                PRO
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Container */}
        <div data-aos="zoom-in" className="w-full max-w-[937px] bg-white/50 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4 p-4 md:p-6 rounded-[26px] backdrop-blur-[35px]">
          {/* Silver Plan */}
          <div data-aos="zoom-in" className="flex flex-col w-full md:w-[30%] rounded-2xl  ">
            <div className="flex flex-col p-5">
              <div className="flex flex-col gap-5">
                <div className="text-black text-2xl md:text-3xl font-bold font-exo">
                {activePlan === "starter" ? "2.8%" : "3.2%"}{" "}
                  <span className="text-[#848484] text-lg md:text-xl font-medium font-inter">
                    /day
                  </span>
                </div>
                <div className="text-[#5b46f6] text-xl md:text-2xl font-bold font-inter">
                  SILVER
                </div>

                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Min Deposit:  { activePlan === "pro" ?  "$60,000.00" : "$500"}
                  </div>
                  
                </div>

                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Referral Bonus:  { activePlan === "pro" ?  "10%" : "5%"}
                  </div>
                  
                </div>
                
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Max Deposit:  { activePlan === "pro" ?  "$100,000.00" : "$1,000.00"}
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    ROI: {activePlan === "starter" ? "2.8%" : "3.2%"} Daily
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Duration: {activePlan === "starter" ? "7" : "14"} Days
                  </div>
                </div>
                <button className="w-full h-11 bg-[#5b46f6]/70 rounded-3xl flex justify-center items-center hover:bg-[#5b46f6] transition-colors duration-300">
                  <div className="text-center text-white text-sm md:text-[15px] font-medium font-inter">Choose plan</div>
                </button>
              </div>
            </div>
          </div>

          {/* Gold Plan */}
          <div data-aos="zoom-in" className="flex flex-col w-full md:w-[30%] rounded-2xl ">
            <div className="flex flex-col p-5">
              <div className="flex flex-col gap-5">
                <div className="text-black text-2xl md:text-3xl font-bold font-exo">
                  {activePlan === "starter" ? "5.7%" : "6.2%"}{" "}
                  <span className="text-[#848484] text-lg md:text-xl font-medium font-inter">
                    /day
                  </span>
                </div>
                <div className="text-[#5b46f6] text-xl md:text-2xl font-bold font-inter">
                  GOLD
                </div>

                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Min Deposit: { activePlan === "pro" ?  "$80,000.00" : "$1,500.00"}
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Referral Bonus:  { activePlan === "pro" ?  "10%" : "5%"}
                  </div>
                  
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Max Deposit:  { activePlan === "pro" ?  "$250,000.00" : "$10,000.00"}
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    ROI: {activePlan === "starter" ? "5.7%" : "6.2%"} Daily
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="black"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div className="text-black text-sm md:text-[15px] font-medium font-inter">
                    Duration: {activePlan === "starter" ? "7" : "14"} Days
                  </div>
                </div>
                <button className="w-full h-11 bg-[#5b46f6]/70 rounded-3xl flex justify-center items-center hover:bg-[#5b46f6] transition-colors duration-300">
                  <div className="text-center text-white text-sm md:text-[15px] font-medium font-inter">Choose plan</div>
                </button>
              </div>
            </div>
          </div>

          {/* Platinum Plan - Featured */}
          <div data-aos="zoom-in"  className="flex flex-col w-full md:w-[30%] bg-[#231D4F] rounded-2xl shadow-lg md:mt-[-30px] relative">
            <div className="flex flex-col p-5">
             
              <div className="flex flex-col gap-5 mt-8 md:mt-0">
                <div className="text-white text-2xl md:text-3xl font-bold font-exo">
                  {activePlan === "starter" ? "8.5%" : "9.2%"}{" "}
                  <span className="text-[#848484] text-lg md:text-xl font-medium font-inter">
                    /day
                  </span>
                </div>
                <div className="text-[#5b46f6] text-xl md:text-2xl font-bold font-inter">
                  PLATINUM
                </div>

                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="white"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="text-white text-sm md:text-[15px] font-medium font-inter">
                    Min Deposit: { activePlan === "pro" ?  "$100,000.00" : "$10,000.00"}
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="white"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="text-white text-sm md:text-[15px] font-medium font-inter">
                    Referral Bonus:  { activePlan === "pro" ?  "10%" : "5%"}
                  </div>
                  
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="white"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="text-white text-sm md:text-[15px] font-medium font-inter">
                    Max Deposit: { activePlan === "pro" ?  "$500,000.00" : "$50,000.00"}
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="white"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="text-white text-sm md:text-[15px] font-medium font-inter">
                    ROI: {activePlan === "starter" ? "8.5%" : "9.2%"} Daily
                  </div>
                </div>
                <div className="justify-start items-start gap-2.5 flex">
                  <div data-svg-wrapper className="relative flex-shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.1"
                        d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
                        fill="white"
                      />
                      <path
                        d="M15.7725 6.83334L10.0683 14.5742C9.93229 14.7547 9.72944 14.8729 9.50535 14.9024C9.28126 14.9319 9.05473 14.87 8.87666 14.7308L4.80333 11.4742C4.44388 11.1865 4.38568 10.662 4.67333 10.3025C4.96098 9.94306 5.48555 9.88486 5.845 10.1725L9.24166 12.89L14.4308 5.84751C14.601 5.59217 14.8977 5.45099 15.2032 5.48004C15.5086 5.50909 15.7734 5.70365 15.8924 5.98649C16.0114 6.26932 15.9653 6.59466 15.7725 6.83334Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="text-white text-sm md:text-[15px] font-medium font-inter">
                    Duration: {activePlan === "starter" ? "7" : "14"} Days
                  </div>
                </div>
                <button className="w-full h-11 bg-[#5b46f6] rounded-3xl self-end flex justify-center items-center">
                  <div className="text-center text-white text-sm md:text-[15px] font-medium font-inter">Choose plan</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
