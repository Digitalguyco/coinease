"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface DrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const Drawer = ({ isOpen, toggleDrawer }: DrawerProps) => {
  const pathname = usePathname();

  // Function to determine if a link is active
  const isActiveLink = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/dashboard";
  };

  // Common classes for all navigation links
  const linkBaseClasses = "flex items-center gap-2 w-full p-2 rounded-lg transition-colors duration-200";
  
  // Classes for active state
  const activeClasses = "bg-[#5B46F6]/20 text-[#5B46F6]";
  
  // Classes for inactive state with hover effect
  const inactiveClasses = "hover:bg-gray-200 dark:hover:bg-gray-700";
  
  // SVG fill colors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activeFill = "#5B46F6";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inactiveFill = "text-gray-800 dark:text-white";

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out dark:bg-gray-800 dark:text-white text-black bg-white w-64 z-30`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <div className="text-2xl text-black dark:text-white font-bold flex gap-0.5 mx-12 my-4 lg:my-0">
            Coin <span className="text-[#5B46F6]">Ease</span>
          </div>
          <button onClick={toggleDrawer} className="text-[#5B46F6]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-3">
            {/* Dashboard Link */}
            <li>
              <Link 
                href="/dashboard" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    id="Vector"
                    d="M1 10H7C7.55 10 8 9.55 8 9V1C8 0.45 7.55 0 7 0H1C0.45 0 0 0.45 0 1V9C0 9.55 0.45 10 1 10ZM1 18H7C7.55 18 8 17.55 8 17V13C8 12.45 7.55 12 7 12H1C0.45 12 0 12.45 0 13V17C0 17.55 0.45 18 1 18ZM11 18H17C17.55 18 18 17.55 18 17V9C18 8.45 17.55 8 17 8H11C10.45 8 10 8.45 10 9V17C10 17.55 10.45 18 11 18ZM10 1V5C10 5.55 10.45 6 11 6H17C17.55 6 18 5.55 18 5V1C18 0.45 17.55 0 17 0H11C10.45 0 10 0.45 10 1Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Dashboard</span>
              </Link>
            </li>
            
            {/* Signal Plans Link */}
            <li>
              <Link 
                href="/dashboard/signal-plans" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard/signal-plans") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard/signal-plans") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Signal Plans</span>
              </Link>
            </li>
            
            {/* Transactions Link */}
            <li>
              <Link 
                href="/dashboard/transactions" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard/transactions") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard/transactions") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    id="Vector"
                    d="M16.509 6.551C16.5868 6.3633 16.6071 6.15676 16.5674 5.9575C16.5278 5.75825 16.4299 5.57524 16.2862 5.43163L11.1514 0.296875L9.69933 1.74898L13.0811 5.13073H0.155881V7.18463H15.5601C15.7632 7.18468 15.9618 7.12451 16.1307 7.01173C16.2996 6.89894 16.4312 6.73861 16.509 6.551ZM0.233929 9.87216C0.156184 10.0599 0.135859 10.2664 0.175527 10.4657C0.215195 10.6649 0.313073 10.8479 0.456777 10.9915L5.59153 16.1263L7.04364 14.6742L3.66189 11.2924H16.5871V9.23853H1.18283C0.979705 9.23834 0.781094 9.29846 0.612168 9.41126C0.443241 9.52406 0.311601 9.68447 0.233929 9.87216Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Transactions</span>
              </Link>
            </li>
            
            {/* Deposit Link */}
            <li>
              <Link 
                href="/dashboard/deposit" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard/deposit") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard/deposit") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    id="Vector"
                    d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9627 4.03725 18 9 18C13.9627 18 18 13.9627 18 9C18 4.03725 13.9627 0 9 0ZM13.5 9.75H9.75V13.5H8.25V9.75H4.5V8.25H8.25V4.5H9.75V8.25H13.5V9.75Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Deposit</span>
              </Link>
            </li>
            
            {/* Withdraw Link */}
            <li>
              <Link 
                href="/dashboard/withdraw" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard/withdraw") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard/withdraw") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    id="Vector"
                    d="M18 4V2C18 0.897 17.103 0 16 0H3C1.346 0 0 1.346 0 3V15C0 17.201 1.794 18 3 18H18C19.103 18 20 17.103 20 16V6C20 4.897 19.103 4 18 4ZM16 13H14V9H16V13ZM3 4C2.74252 3.98848 2.49941 3.87809 2.32128 3.69182C2.14315 3.50554 2.04373 3.25774 2.04373 3C2.04373 2.74226 2.14315 2.49446 2.32128 2.30818C2.49941 2.12191 2.74252 2.01152 3 2H16V4H3Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Withdraw</span>
              </Link>
            </li>
            
            {/* Invest Link */}
            <li>
              <Link 
                href="/dashboard/invest" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard/invest") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard/invest") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    id="Vector"
                    d="M4.5 0H2.25V2.25H0V15.75H2.25V18H4.5V15.75H6.75V2.25H4.5V0ZM15.75 4.5H13.5V0H11.25V4.5H9V12.375H11.25V18H13.5V12.375H15.75V4.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Invest</span>
              </Link>
            </li>
            
            <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>
            
            {/* Profile Link */}
            <li>
              <Link 
                href="/dashboard/profile" 
                className={`${linkBaseClasses} ${isActiveLink("/dashboard/profile") ? activeClasses : inactiveClasses}`}
              >
                <svg
                  width="17"
                  height="18"
                  viewBox="0 0 17 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isActiveLink("/dashboard/profile") ? "text-[#5B46F6]" : "text-gray-800 dark:text-white"}
                >
                  <path
                    id="Vector"
                    d="M16.338 14.6894C15.9114 13.679 15.2924 12.7612 14.5154 11.9872C13.7407 11.2109 12.8231 10.592 11.8131 10.1646C11.8041 10.1601 11.795 10.1578 11.786 10.1533C13.1948 9.13568 14.1106 7.47814 14.1106 5.60804C14.1106 2.51005 11.6006 0 8.50257 0C5.40458 0 2.89453 2.51005 2.89453 5.60804C2.89453 7.47814 3.81036 9.13568 5.21915 10.1555C5.21011 10.16 5.20106 10.1623 5.19202 10.1668C4.17895 10.5942 3.26991 11.207 2.48976 11.9894C1.71347 12.7641 1.09454 13.6817 0.667142 14.6917C0.247267 15.6805 0.0208197 16.7406 5.65462e-05 17.8146C-0.000547008 17.8387 0.00368622 17.8627 0.0125069 17.8852C0.0213276 17.9077 0.0345572 17.9281 0.0514162 17.9454C0.0682753 17.9627 0.0884226 17.9764 0.110671 17.9858C0.132919 17.9952 0.156819 18 0.180961 18H1.53774C1.63724 18 1.71639 17.9209 1.71865 17.8236C1.76388 16.0779 2.46488 14.443 3.70408 13.2038C4.98624 11.9216 6.689 11.2161 8.50257 11.2161C10.3161 11.2161 12.0189 11.9216 13.3011 13.2038C14.5403 14.443 15.2413 16.0779 15.2865 17.8236C15.2887 17.9231 15.3679 18 15.4674 18H16.8242C16.8483 18 16.8722 17.9952 16.8945 17.9858C16.9167 17.9764 16.9369 17.9627 16.9537 17.9454C16.9706 17.9281 16.9838 17.9077 16.9926 17.8852C17.0015 17.8627 17.0057 17.8387 17.0051 17.8146C16.9825 16.7337 16.7586 15.6822 16.338 14.6894ZM8.50257 9.49749C7.46463 9.49749 6.48774 9.09271 5.75282 8.35779C5.0179 7.62286 4.61312 6.64598 4.61312 5.60804C4.61312 4.5701 5.0179 3.59322 5.75282 2.85829C6.48774 2.12337 7.46463 1.71859 8.50257 1.71859C9.54051 1.71859 10.5174 2.12337 11.2523 2.85829C11.9872 3.59322 12.392 4.5701 12.392 5.60804C12.392 6.64598 11.9872 7.62286 11.2523 8.35779C10.5174 9.09271 9.54051 9.49749 8.50257 9.49749Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-lg font-inter">Profile</span>
              </Link>
            </li>
            
            {/* Support Link */}
            <li className="relative group">
              <button 
                className={`${linkBaseClasses} ${inactiveClasses}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-gray-800 dark:text-white"
                  fill="currentColor"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                  <path d="M11 11h2v6h-2zm0-4h2v2h-2z"/>
                </svg>
                <span className="text-lg font-inter">Support</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-auto text-gray-600 dark:text-gray-400"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Support Options Dropdown */}
              <div className="ml-8 mt-1 hidden group-hover:block">
                <a 
                  href="https://wa.link/5uy9hp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="text-[#25D366]"
                    fill="currentColor"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.56 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67Z"/>
                  </svg>
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a 
                  href="mailto:communications@coinease.live"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    className="text-[#5B46F6]"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"/>
                  </svg>
                  <span className="text-sm">Email</span>
                </a>
              </div>
            </li>
            
            {/* Logout Link */}
            <li>
              <button 
                onClick={handleLogout}
                className={`${linkBaseClasses} ${inactiveClasses}`}
              >
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-800 dark:text-white"
                >
                  <g id="Group 237529">
                    <path
                      id="Vector"
                      d="M13.4675 3.81452L12.2276 5.05449L14.4965 7.33217H5.55284V9.09099H14.4965L12.2276 11.3599L13.4675 12.6086L17.8646 8.21158L13.4675 3.81452ZM2.03519 2.0557H9.07049V0.296875H2.03519C1.06784 0.296875 0.276367 1.08835 0.276367 2.0557V14.3675C0.276367 15.3348 1.06784 16.1263 2.03519 16.1263H9.07049V14.3675H2.03519V2.0557Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
                <span className="text-lg font-inter">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Drawer;
