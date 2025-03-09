"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../components/Dashboard/Drawer";
import Header from "../components/Dashboard/Header";
import LoadingSpinner from "../components/Dashboard/LoadingSpinner";

// Use React.lazy to dynamically import the TradingViewWidget
const TradingViewWidget = React.lazy(() => import("../components/Dashboard/TradingView"));

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [theme, setTheme] = useState("light");
//   const [isLoading, setIsLoading] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.livecoinwatch.com/static/lcw-widget.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);


  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex h-screen overflow-hidden">
        {/* Drawer Navigation */}
        <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <Header isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden">
            {/* Top row with balance and crypto widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
              {/* Balance Card */}
              <div className="flex flex-col justify-between h-auto gap-3 sm:gap-4 md:gap-6 border border-gray-500 p-3 sm:p-4 rounded-xl">
                <div className="flex items-center gap-2 md:gap-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  >
                    <path
                      id="Vector"
                      d="M18 4V2C18 0.897 17.103 0 16 0H3C1.346 0 0 1.346 0 3V15C0 17.201 1.794 18 3 18H18C19.103 18 20 17.103 20 16V6C20 4.897 19.103 4 18 4ZM16 13H14V9H16V13ZM3 4C2.74252 3.98848 2.49941 3.87809 2.32128 3.69182C2.14315 3.50554 2.04373 3.25774 2.04373 3C2.04373 2.74226 2.14315 2.49446 2.32128 2.30818C2.49941 2.12191 2.74252 2.01152 3 2H16V4H3Z"
                      fill="#5B46F6"
                    />
                  </svg>
                  <div className="text-base sm:text-lg font-semibold font-inter leading-tight md:leading-7">
                    Balance
                  </div>
                  <div className="text-xs sm:text-sm font-inter bg-[#5B46F6] text-white px-2 sm:px-4 self-end py-1 sm:py-2 rounded-xl sm:rounded-2xl whitespace-nowrap">
                    <span className="mr-2">+</span>Add Funds
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold font-inter leading-tight md:leading-7">
                  $200,000
                </div>
                <div className="flex flex-wrap justify-between items-center gap-1 sm:gap-2">
                  <div className="text-grey-500 text-xs sm:text-sm font-inter">Daily</div>
                  <div className="text-green-600 text-xs sm:text-sm font-semibold font-inter">+$2398</div>
                  <div className="text-green-600 text-xs sm:text-sm font-semibold font-inter bg-black/60 rounded-full px-2 py-1">
                    +14.9%
                  </div>
                </div>
              </div>

              {/* Crypto Widgets - using grid cells */}
              <div>
                <div
                  className="livecoinwatch-widget-1"
                  lcw-coin="ETH"
                  lcw-base="USD"
                  lcw-secondary="BTC"
                  lcw-period="d"
                  lcw-color-tx="#0693e3"
                  lcw-color-pr="#58c7c5"
                  lcw-color-bg={theme === "dark" ? "#1f2434" : "white"}
                  lcw-border-w="1"
                ></div>
              </div>
              <div>
                <div
                  className="livecoinwatch-widget-1"
                  lcw-coin="BTC"
                  lcw-base="USD"
                  lcw-secondary="BTC"
                  lcw-period="d"
                  lcw-color-tx="#0693e3"
                  lcw-color-pr="#58c7c5"
                  lcw-color-bg={theme === "dark" ? "#1f2434" : "white"}
                  lcw-border-w="1"
                ></div>
              </div>
              <div>
                <div
                  className="livecoinwatch-widget-1"
                  lcw-coin="LTC"
                  lcw-base="USD"
                  lcw-secondary="BTC"
                  lcw-period="d"
                  lcw-color-tx="#0693e3"
                  lcw-color-pr="#58c7c5"
                  lcw-color-bg={theme === "dark" ? "#1f2434" : "white"}
                  lcw-border-w="1"
                ></div>
              </div>
            </div>

            {/* Bottom section with chart and investment plans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* TradingView Chart */}
              <div className="lg:col-span-2">
                <Suspense fallback={<LoadingSpinner />}>
                  <TradingViewWidget />
                </Suspense>
              </div>

              {/* Investment Plans */}
              <div className="flex flex-col justify-between gap-3 sm:gap-4 md:gap-6 border border-grey-500 p-3 sm:p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <div className="text-base sm:text-lg font-bold font-inter leading-tight md:leading-7">
                    Top Plans
                  </div>
                  <div className="text-xs sm:text-sm font-inter bg-[#5B46F6] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl">
                    View All
                  </div>
                </div>

                {/* Investment Plan Cards */}
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex justify-between items-center p-2 sm:p-4 border border-[#5B46F6] rounded-xl">
                    <div>
                      <div className="text-xs sm:text-sm font-inter leading-tight md:leading-7">
                        Starter plan
                      </div>
                      <div className="text-sm sm:text-base md:text-lg font-semibold font-inter leading-tight md:leading-7">
                        4% daily
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-inter bg-[#5B46F6] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl whitespace-nowrap">
                      Invest
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
