import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      {/* First section */}
      <section data-aos="zoom-in-left" className="px-4 md:px-8 lg:mx-12 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 justify-center items-center lg:justify-around container mx-auto">
          {/* Image container - full width on mobile, half on desktop */}
          <div className="w-full lg:w-auto flex justify-center">
            <div className="relative">
              <Image 
                src="/globe.png" 
                alt="about" 
                width={500} 
                height={500}
                className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[500px] h-auto animate-float"
              />
              <style jsx global>{`
                @keyframes float {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-20px); }
                  100% { transform: translateY(0px); }
                }
                .animate-float {
                  animation: float 4s ease-in-out infinite;
                }
              `}</style>
            </div>
          </div>
          
          {/* Text content - full width on mobile, half on desktop */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 w-full lg:w-auto">
            <div>
              <span className="text-[#fd8d1e] text-sm md:text-base font-semibold font-inter">
                YOUR GATEWAY TO THE GLOBAL ECONOMY
              </span>
            </div>
            <div className="w-full max-w-[505px] text-2xl md:text-3xl lg:text-[42px] font-bold font-inter leading-tight lg:leading-[50px]">
              Coin <span className="text-[#5b46f6]">Ease</span> crypto
              Investing, trading, and custody for worldwide
            </div>
            <div className="w-full max-w-[455px] text-[#848484] text-sm md:text-base font-normal font-inter leading-relaxed">
              Institutional Markets is a full-stack crypto services platform
              that works worldwide with crypto-native businesses and
              institutional clients on trading, and custody solutions.
            </div>
            <div className="w-full sm:w-[185px] h-[58px] bg-[#468cf6] rounded-lg flex items-center justify-center">
              <div className="text-white text-base font-normal font-inter leading-relaxed">
                Get in now
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second section */}
      <section  data-aos="zoom-out-up"  className="px-4 md:px-8 lg:mx-12 mb-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 container mx-auto">
          {/* Left column */}
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 w-full lg:w-auto">
            <div className="w-full max-w-[333px] text-2xl md:text-3xl lg:text-[42px] font-bold font-inter leading-tight lg:leading-[50px]">
              We make crypto easy.
            </div>
            <div className="w-full max-w-[359px] text-[#848484] text-sm md:text-base font-normal font-inter leading-relaxed">
              Specific cryptocurrencies work and get a bit of crypto to try out
              for yourself. Here are a few reasons why you should choose besnik
              crypto
            </div>

            <div className="w-full sm:w-[185px] h-[58px] flex items-center justify-center bg-[#5b46f6] rounded-lg">
              <div className="text-center text-[#fefdff] text-base font-medium font-inter leading-none">
                Learn more
              </div>
            </div>
          </div>

          {/* Middle column */}
          <div className="flex flex-col gap-8 md:gap-10 w-full lg:w-auto">
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <div data-svg-wrapper className="flex-shrink-0">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1_171)">
                      <path
                        d="M21.3944 15.8538L15.2421 14.096C15.0841 14.0513 14.9159 14.0513 14.7579 14.096L8.60561 15.8538C8.22967 15.962 7.96875 16.307 7.96875 16.6992V20.9646C7.96875 25.1257 10.7617 28.8276 14.7596 29.9666C14.8386 29.9889 14.9193 30 15 30C15.0807 30 15.1614 29.9889 15.2404 29.9666C19.2383 28.8276 22.0312 25.1257 22.0312 20.9646V16.6992C22.0312 16.307 21.7703 15.962 21.3944 15.8538ZM18.2581 20.9534L14.7425 24.4691C14.5708 24.6408 14.3459 24.7266 14.1211 24.7266C13.8963 24.7266 13.6713 24.6408 13.4997 24.4691L11.7419 22.7113C11.3986 22.368 11.3986 21.8117 11.7419 21.4684C12.0852 21.1251 12.6414 21.1251 12.9847 21.4684L14.1211 22.6049L17.0153 19.7106C17.3586 19.3673 17.9149 19.3673 18.2582 19.7106C18.6015 20.0539 18.6015 20.6101 18.2581 20.9534Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M23.7891 5.27344C23.3548 5.27344 22.9273 5.31809 22.5067 5.4082C21.4459 2.22475 18.4281 0 15 0C11.5719 0 8.5541 2.22475 7.49326 5.4082C7.07268 5.31809 6.64523 5.27344 6.21094 5.27344C2.81889 5.27344 0 8.03373 0 11.4258C0 14.8178 2.81889 17.5781 6.21094 17.5781V16.6992C6.21094 15.5302 6.99545 14.4882 8.1198 14.1646L14.2756 12.4059C14.5142 12.3381 14.7563 12.3047 15 12.3047C15.2437 12.3047 15.4858 12.3381 15.7192 12.4042L21.8767 14.1637C23.0046 14.4882 23.7891 15.5302 23.7891 16.6992V17.5781C27.1811 17.5781 30 14.8178 30 11.4258C30 8.03373 27.1811 5.27344 23.7891 5.27344Z"
                        fill="#FD8D1E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_171">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="text-[#1d2d3f] text-xl md:text-[22px] font-semibold font-inter">
                  Secure storage
                </div>
              </div>
              <div className="w-full max-w-[250px] ml-0 md:ml-10 text-[#848484] text-sm md:text-base font-normal font-inter leading-relaxed">
                We store the vast majority of the digital assets in secure
                offline storage.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <div data-svg-wrapper className="flex-shrink-0">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1_179)">
                      <path
                        d="M15 16.697C17.9129 16.697 20.2743 14.3356 20.2743 11.4227C20.2743 8.50981 17.9129 6.14844 15 6.14844C12.0871 6.14844 9.72577 8.50981 9.72577 11.4227C9.72577 14.3356 12.0871 16.697 15 16.697Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M25.1769 9.29313C24.8189 9.02702 24.703 8.58322 24.879 8.16772C25.3829 7.00023 25.1734 6.19245 24.8953 5.69538C24.4858 5.01377 23.7578 4.61802 22.7551 4.52015C22.2942 4.46348 21.9594 4.12869 21.9053 3.68916C21.8048 2.66502 21.4091 1.93711 20.7026 1.513C20.2313 1.24858 19.4201 1.03913 18.262 1.5413C17.8397 1.71729 17.395 1.60395 17.1246 1.23915C15.8713 -0.410763 14.1338 -0.41762 12.8702 1.246C12.6049 1.60395 12.1611 1.71987 11.7448 1.54388C10.579 1.04083 9.76948 1.24858 9.27241 1.52759C8.59079 1.93705 8.19505 2.66502 8.09718 3.66771C8.04051 4.12869 7.70571 4.46348 7.26619 4.51757C6.24204 4.61802 5.51414 5.01377 5.09003 5.72023C4.82649 6.19239 4.61704 7.00017 5.11833 8.16163C5.29689 8.5831 5.18098 9.02696 4.81617 9.29823C3.99122 9.92488 3.57227 10.6391 3.57227 11.4229C3.57227 12.2066 3.99116 12.9209 4.82303 13.5527C5.18098 13.8188 5.29689 14.2626 5.12091 14.6781C4.61698 15.8456 4.82649 16.6534 5.10462 17.1505C5.51408 17.8321 6.24204 18.2278 7.24474 18.3257C7.70571 18.3823 8.04051 18.7171 8.0946 19.1567C8.19505 20.1808 8.59079 20.9087 9.29725 21.3328C9.76854 21.5972 10.5772 21.8058 11.7387 21.3045C12.1653 21.126 12.6048 21.2436 12.8753 21.6067C13.5019 22.4316 14.2162 22.8506 14.9999 22.8506C15.7837 22.8506 16.4979 22.4317 17.1297 21.5998C17.3958 21.2419 17.8379 21.1285 18.2551 21.3019C19.4226 21.8059 20.2313 21.5964 20.7275 21.3182C21.4091 20.9088 21.8048 20.1808 21.9027 19.1781C21.9594 18.7171 22.2942 18.3823 22.7337 18.3283C23.7578 18.2278 24.4858 17.8321 24.9099 17.1256C25.1734 16.6534 25.3828 15.8457 24.8816 14.6842C24.703 14.2627 24.8189 13.8189 25.1837 13.5476C26.0087 12.921 26.4276 12.2067 26.4276 11.4229C26.4276 10.6392 26.0087 9.92493 25.1769 9.29313ZM15 18.4552C11.1224 18.4552 7.96767 15.3005 7.96767 11.4229C7.96767 7.5453 11.1224 4.39052 15 4.39052C18.8776 4.39052 22.0324 7.5453 22.0324 11.4229C22.0324 15.3005 18.8776 18.4552 15 18.4552Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M11.8624 23.25C11.3714 23.4054 10.8795 23.4844 10.3996 23.4844C9.70082 23.4852 9.02179 23.311 8.43722 22.983C8.14011 22.8051 7.83139 22.5462 7.53737 22.2341L5.49447 25.0939C5.30302 25.3617 5.27729 25.7137 5.42749 26.0073C5.57857 26.3 5.87985 26.4837 6.20955 26.4837H9.18236L10.6975 29.514C10.8469 29.8119 11.1507 29.9999 11.4838 29.9999C11.8169 29.9999 12.1208 29.8119 12.2702 29.514L14.6786 24.6971C13.8717 24.6334 12.8449 24.3151 11.8624 23.25Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M22.4691 22.2434C22.1918 22.5357 21.9042 22.7799 21.6332 22.943C20.9791 23.3104 20.3086 23.4829 19.5944 23.4829C19.1196 23.4829 18.6312 23.4048 18.1359 23.2494C17.1478 24.3156 16.1249 24.6337 15.3214 24.6974L17.7298 29.5143C17.8792 29.8122 18.1831 30.0002 18.5161 30.0002C18.8492 30.0002 19.1531 29.8122 19.3025 29.5143L20.8176 26.484H23.7904C24.12 26.484 24.4214 26.3003 24.5725 26.0076C24.7227 25.714 24.6969 25.362 24.5055 25.0942L22.4691 22.2434Z"
                        fill="#FD8D1E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_179">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="text-[#1d2d3f] text-xl md:text-[22px] font-semibold font-inter">
                  Industry best practices
                </div>
              </div>
              <div className="w-full max-w-[250px] ml-0 md:ml-10 text-[#848484] text-sm md:text-base font-normal font-inter leading-relaxed">
                CoinEase crypto supports a variety of the most popular digital
                crypto currencies.
              </div>
            </div>
          </div>

          {/* Right column - stacks below on mobile */}
          <div className="flex flex-col gap-8 md:gap-10 w-full lg:w-auto mt-8 lg:mt-0">
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <div data-svg-wrapper className="flex-shrink-0">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1_146)">
                      <path
                        d="M14.8258 12.4125H14.8383L20.9633 10.325C20.9883 10.2125 20.9883 10.1 20.9883 10C20.9883 9.8875 20.9758 9.7875 20.9383 9.6875C20.8383 9.4 20.6508 9.0875 20.3883 8.8625V6.125C20.3883 4.1 19.6633 3.3 18.9133 2.8375C18.5258 1.6625 16.9133 0 13.7508 0C10.0008 0 7.17583 3.7125 7.17583 6.125C7.17583 7.125 7.13833 7.9125 7.10083 8.5125C7.10083 8.6375 7.08834 8.75 7.08834 8.85C6.81333 9.1 6.62583 9.4375 6.53833 9.7625C6.52583 9.8375 6.51333 9.9125 6.51333 10C6.51333 10.975 7.06333 12.3875 7.13833 12.55C7.21334 12.7625 7.37583 12.9375 7.58834 13.0375C7.60083 13.0875 7.61334 13.1625 7.61334 13.3125C7.61334 14.6375 8.75083 15.8875 9.37584 16.4875C9.31334 17.8625 8.92583 18.8125 8.37583 19.05L3.47583 20.675C2.08833 21.1375 1.05083 22.2625 0.688334 23.6875L0.0258338 26.3375C-0.0366662 26.6125 0.0258338 26.9125 0.200834 27.1375C0.375834 27.3625 0.650834 27.5 0.938334 27.5H14.9508C14.5758 27.025 14.2258 26.5 13.9008 25.9375C13.0758 24.475 12.5008 22.7 12.5008 20.6875V15.675C12.5008 14.2 13.4383 12.9 14.8258 12.4125Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M29.3637 14.7825L22.8012 12.55C22.6062 12.4825 22.3938 12.4825 22.1988 12.55L15.6362 14.7825C15.255 14.9113 15 15.2675 15 15.67V20.6925C15 26.8225 21.8425 29.8025 22.1338 29.9263C22.3688 30.025 22.6312 30.025 22.8662 29.9263C23.1575 29.8013 30 26.8225 30 20.6925V15.67C30 15.2675 29.745 14.9113 29.3637 14.7825ZM26.6075 19.5225L23.17 23.8975C22.7325 24.4563 21.9125 24.5375 21.3738 24.075L19.1862 22.2C18.6612 21.7513 18.6 20.9613 19.0513 20.4375C19.5 19.9138 20.29 19.8538 20.8125 20.3025L22.01 21.3288L24.6412 17.98C25.0675 17.4375 25.8525 17.3413 26.3963 17.77C26.94 18.1938 27.035 18.98 26.6075 19.5225Z"
                        fill="#FD8D1E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_146">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="text-[#1d2d3f] text-xl md:text-[22px] font-semibold font-inter">
                  Protected by insurance
                </div>
              </div>
              <div className="w-full max-w-[250px] ml-0 md:ml-10 text-[#848484] text-sm md:text-base font-normal font-inter leading-relaxed">
                Cryptocurrency stored on our servers is covered by our insurance policy.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <div data-svg-wrapper className="flex-shrink-0">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1_153)">
                      <path
                        d="M12.2111 5.99272C12.4063 5.79748 12.4063 5.481 12.2112 5.28574L10.7497 3.82353C10.4347 3.50843 9.89602 3.73149 9.89602 4.177V4.76696C7.28941 4.85568 4.85291 5.91071 3.00176 7.76187C1.27423 9.4894 0.239354 11.7266 0.036745 14.1361C-0.00392764 14.6198 0.3935 15.0141 0.878906 15.0141C1.36431 15.0141 1.75303 14.6193 1.8028 14.1365C2.23135 9.97934 5.66994 6.70211 9.89602 6.52601V7.10106C9.89602 7.54654 10.4346 7.76961 10.7496 7.45457L12.2111 5.99272Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M29.1211 15.0142C28.6357 15.0142 28.247 15.4089 28.1972 15.8917C27.7687 20.0488 24.3301 23.3261 20.104 23.5022V22.9271C20.104 22.4816 19.5654 22.2586 19.2504 22.5736L17.7889 24.0355C17.5937 24.2307 17.5937 24.5472 17.7889 24.7424L19.2504 26.2046C19.5653 26.5197 20.104 26.2967 20.104 25.8512V25.2612C22.7106 25.1725 25.1471 24.1175 26.9983 22.2663C28.7259 20.5388 29.7607 18.3017 29.9633 15.8922C30.004 15.4085 29.6065 15.0142 29.1211 15.0142Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M8.13182 18.1979C8.02384 18.2157 7.91366 18.2157 7.80568 18.1979L1.16307 17.1C0.553942 16.9993 0 17.4692 0 18.0866V27.802C0 28.2914 0.354129 28.7088 0.836926 28.7886L7.80568 29.9405C7.91366 29.9583 8.02384 29.9583 8.13182 29.9405L15.1006 28.7886C15.5834 28.7088 15.9375 28.2914 15.9375 27.802V18.0866C15.9375 17.4692 15.3836 16.9993 14.7744 17.1L8.13182 18.1979ZM8.84766 27.295C8.84766 27.725 8.5364 28.092 8.11206 28.1621C8.01716 28.1778 7.92034 28.1778 7.82544 28.1621C7.4011 28.092 7.08984 27.725 7.08984 27.295V20.6425C7.08984 20.2334 7.45697 19.9219 7.86068 19.9886C7.93224 20.0005 8.00526 20.0005 8.07682 19.9886C8.48053 19.9219 8.84766 20.2334 8.84766 20.6425V27.295Z"
                        fill="#FD8D1E"
                      />
                      <path
                        d="M22.1943 1.32289C22.0863 1.34074 21.9762 1.34074 21.8682 1.32289L15.2256 0.224955C14.6164 0.124274 14.0625 0.594174 14.0625 1.21157V10.927C14.0625 11.4164 14.4166 11.8338 14.8994 11.9136L21.8682 13.0655C21.9762 13.0833 22.0863 13.0833 22.1943 13.0655L29.1631 11.9136C29.6459 11.8338 30 11.4164 30 10.927V1.21157C30 0.594175 29.4461 0.124274 28.8369 0.224956L22.1943 1.32289ZM22.9102 10.42C22.9102 10.85 22.5989 11.217 22.1746 11.2871C22.0797 11.3028 21.9828 11.3028 21.8879 11.2871C21.4636 11.217 21.1523 10.85 21.1523 10.42V3.76754C21.1523 3.35836 21.5195 3.04692 21.9232 3.11364C21.9947 3.12547 22.0678 3.12547 22.1393 3.11364C22.543 3.04692 22.9102 3.35836 22.9102 3.76754V10.42Z"
                        fill="#FD8D1E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_153">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="text-[#1d2d3f] text-xl md:text-[22px] font-semibold font-inter">
                  Trade Assets
                </div>
              </div>
              <div className="w-full max-w-[250px] ml-0 md:ml-10 text-[#848484] text-sm md:text-base font-normal font-inter leading-relaxed">
                Discover new and innovative crypto assets with over 200 spot trading pairs and 25 margin.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
