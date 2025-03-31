"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header({
  toggleDrawer,
}: {
  isOpen?: boolean;
  toggleDrawer: () => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<SVGSVGElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userAvatarRef = useRef<HTMLDivElement>(null);
  const [activeInvestments, setActiveInvestments] = useState(0);
  
  const { user, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle notifications dropdown
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      
      // Handle user menu dropdown
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        userAvatarRef.current &&
        !userAvatarRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch active investments count
  useEffect(() => {
    const fetchActiveInvestments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://coinease.live/api/transactions/investments/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        // Count only active investments
        const activeCount = data.filter((investment) => 
          investment.status === 'active' || investment.status === 'ongoing'
        ).length;
        setActiveInvestments(activeCount);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchActiveInvestments();
    // Refresh every 5 minutes
    const interval = setInterval(fetchActiveInvestments, 300000);
    return () => clearInterval(interval);
  }, []);

  // Signal bar renderer
  const renderSignalBars = () => {
    const bars = 4; // Total number of bars
    const hasActiveInvestments = activeInvestments > 0;

    return (
      <div className="group relative cursor-help">
        <div className="flex items-end h-6 gap-[2px] mx-4">
          {[...Array(bars)].map((_, index) => (
            <div
              key={index}
              className={`w-1 rounded-sm transition-all duration-300 ${
                !hasActiveInvestments && index > 0 ? 'opacity-0' : ''
              }`}
              style={{
                height: `${((index + 1) / bars) * 24}px`,
                backgroundColor: hasActiveInvestments 
                  ? '#4CAF50' // Green for active investments
                  : (index === 0 ? '#FF5959' : 'transparent'), // Red only for first bar when inactive
                opacity: hasActiveInvestments 
                  ? 1 // Full opacity for all bars when active
                  : (index === 0 ? 1 : 0) // Only show first bar when inactive
              }}
            />
          ))}
          
          {/* Tooltip */}
          <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8 whitespace-nowrap">
            {activeInvestments > 0 
              ? `${activeInvestments} Active Investment${activeInvestments > 1 ? 's' : ''}`
              : 'No Active Investments'}
          </div>
        </div>
      </div>
    );
  };

  // Sample notifications - can be replaced with real data later
  const notifications: unknown[] = [];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-between shadow p-2 sm:p-4 sticky top-0 dark:bg-black bg-white z-20">
      <button onClick={toggleDrawer} className="text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="white"
          viewBox="0 0 24 24"
          stroke="#5B46F6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="flex items-center space-x-2 sm:space-x-6 md:space-x-10">
        {/* Signal Bars - Add this before the bell icon */}
        <div className="group relative cursor-help">
          {renderSignalBars()}
        </div>

        {/* Bell Icon - Now Interactive */}
        <div className="relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 27 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden sm:block cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowNotifications(!showNotifications)}
            ref={bellRef}
          >
            <g id="Group 237544">
              <path
                id="Vector"
                d="M22.2069 15.0486V12.5517H20.2759V15.4483C20.2759 15.7043 20.3777 15.9499 20.5588 16.1309L23.1724 18.7446V20.2759H1.93103V18.7446L4.54469 16.1309C4.72577 15.9499 4.82753 15.7043 4.82759 15.4483V11.5862C4.8249 10.2295 5.18029 8.89602 5.85788 7.72058C6.53546 6.54514 7.51124 5.56933 8.68666 4.8917C9.86207 4.21408 11.1955 3.85863 12.5522 3.86128C13.909 3.86392 15.241 4.22456 16.4138 4.90676V2.74883C15.4947 2.34188 14.5172 2.08251 13.5172 1.98028V0H11.5862V1.97931C9.2058 2.22159 6.99977 3.3379 5.3947 5.1124C3.78963 6.88689 2.89955 9.1935 2.89655 11.5862V15.0486L0.282897 17.6622C0.101814 17.8432 5.46844e-05 18.0888 0 18.3448V21.2414C0 21.4974 0.101724 21.743 0.282793 21.9241C0.463863 22.1052 0.709446 22.2069 0.965517 22.2069H7.72414V23.1724C7.72414 24.4528 8.23276 25.6807 9.13811 26.586C10.0435 27.4914 11.2714 28 12.5517 28C13.8321 28 15.06 27.4914 15.9653 26.586C16.8707 25.6807 17.3793 24.4528 17.3793 23.1724V22.2069H24.1379C24.394 22.2069 24.6396 22.1052 24.8207 21.9241C25.0017 21.743 25.1034 21.4974 25.1034 21.2414V18.3448C25.1034 18.0888 25.0016 17.8432 24.8206 17.6622L22.2069 15.0486ZM15.4483 23.1724C15.4483 23.9406 15.1431 24.6774 14.5999 25.2206C14.0567 25.7638 13.3199 26.069 12.5517 26.069C11.7835 26.069 11.0468 25.7638 10.5036 25.2206C9.96034 24.6774 9.65517 23.9406 9.65517 23.1724V22.2069H15.4483V23.1724Z"
                fill={showNotifications ? "#5B46F6" : "grey"}
                className="transition-colors duration-200"
              />
              <g id="Group 237543">
                <path
                  id="Vector_2"
                  d="M22.2068 10.6206C24.3398 10.6206 26.0689 8.89152 26.0689 6.75855C26.0689 4.62559 24.3398 2.89648 22.2068 2.89648C20.0738 2.89648 18.3447 4.62559 18.3447 6.75855C18.3447 8.89152 20.0738 10.6206 22.2068 10.6206Z"
                  fill="#FF5959"
                />
              </g>
            </g>
          </svg>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div 
              ref={notificationRef}
              className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div 
                      key={index} 
                      className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      {/* Notification content would go here */}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    <svg 
                      className="mx-auto h-10 w-10 mb-2 text-gray-400 dark:text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M18 2v4h-4" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M18 6l-8 8" 
                      />
                    </svg>
                    <p className="text-sm">No new notifications</p>
                    <p className="text-xs mt-1">We&apos;ll notify you when something arrives</p>
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#F2F8FF] dark:bg-transparent flex justify-between py-1 sm:py-2 px-2 sm:px-4 md:px-6 rounded-2xl items-center space-x-2 sm:space-x-4 md:space-x-10">
          <div 
            ref={userAvatarRef}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: "url('/default.png')" }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          ></div>
          <div className="hidden sm:block">
            <div className="text-sm md:text-md font-semibold leading-tight md:leading-7 font-inter">
              {user?.full_name || 'User'}
            </div>
            <div className="text-xs md:text-sm font-inter truncate max-w-[120px] md:max-w-none">
              {user?.email || 'user@example.com'}
            </div>
          </div>
          <svg
            width="4"
            height="16"
            viewBox="0 0 5 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <path
              id="Vector"
              d="M4.53259 17.3748C4.53259 17.9759 4.29382 18.5523 3.8688 18.9773C3.44379 19.4023 2.86735 19.6411 2.26629 19.6411C1.66523 19.6411 1.08879 19.4023 0.663781 18.9773C0.238769 18.5523 -7.27897e-08 17.9759 -9.90628e-08 17.3748C-1.25336e-07 16.7738 0.238769 16.1973 0.663781 15.7723C1.08879 15.3473 1.66523 15.1085 2.26629 15.1085C2.86735 15.1085 3.44379 15.3473 3.8688 15.7723C4.29382 16.1973 4.53259 16.7738 4.53259 17.3748ZM4.53259 9.82051C4.53259 10.4216 4.29382 10.998 3.8688 11.423C3.44379 11.848 2.86735 12.0868 2.26629 12.0868C1.66523 12.0868 1.08879 11.848 0.663781 11.423C0.238769 10.998 -4.02999e-07 10.4216 -4.29272e-07 9.82051C-4.55545e-07 9.21945 0.238769 8.64301 0.663781 8.218C1.08879 7.79299 1.66523 7.55422 2.26629 7.55422C2.86735 7.55422 3.44379 7.79299 3.8688 8.218C4.29382 8.64301 4.53259 9.21945 4.53259 9.82051ZM4.53258 2.2662C4.53258 2.86726 4.29382 3.4437 3.8688 3.86871C3.44379 4.29373 2.86735 4.5325 2.26629 4.5325C1.66523 4.5325 1.08879 4.29373 0.663781 3.86871C0.238768 3.4437 -7.33208e-07 2.86726 -7.59481e-07 2.2662C-7.85755e-07 1.66514 0.238768 1.08871 0.663781 0.663692C1.08879 0.23868 1.66523 -8.97182e-05 2.26629 -8.97444e-05C2.86735 -8.97707e-05 3.44379 0.23868 3.8688 0.663692C4.29382 1.0887 4.53258 1.66514 4.53258 2.2662Z"
              fill="#A2A7B4"
            />
          </svg>
          
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div 
              ref={userMenuRef}
              className="absolute right-4 top-14 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30 overflow-hidden"
            >
              <div className="py-1">
                  <Link 
                    href="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile Settings
                  </Link>

                  <Link 
                    href="/dashboard/myinvestments" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Investments
                  </Link>

                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
