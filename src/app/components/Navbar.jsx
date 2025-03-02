import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile when component mounts and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link (for mobile)
  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav id="navbar" className="navbar p-0 relative">
      {/* Hamburger icon for mobile */}
      <div 
        className="md:hidden z-50 cursor-pointer p-2"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          // X icon when menu is open
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon when menu is closed
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </div>
      
      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      ></div>
      
      {/* Navigation links */}
      <ul 
        className={`flex md:flex-row flex-col m-0 p-0 list-none items-center md:relative fixed md:h-auto h-screen md:w-auto w-[250px] top-0 right-0 bg-[#15222b] md:bg-transparent z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'transform-none' : 'translate-x-full md:translate-x-0'
        } md:items-center md:justify-start justify-center space-y-4 md:space-y-0 pt-16 md:pt-0`}
      >
        <li className="relative whitespace-nowrap py-2 px-3">
          <Link 
            className="nav-link scrollto active flex items-center justify-between p-0 text-sm uppercase font-semibold text-white transition duration-300" 
            href="/"
            onClick={closeMenu}
          >
            Home
          </Link>
        </li>
        <li className="relative whitespace-nowrap py-2 px-3">
          <a 
            className="nav-link scrollto flex items-center justify-between p-0 text-sm uppercase font-semibold text-white transition duration-300" 
            href="#about"
            onClick={closeMenu}
          >
            About
          </a>
        </li>
        <li className="relative whitespace-nowrap py-2 px-3">
          <a 
            className="nav-link scrollto flex items-center justify-between p-0 text-sm uppercase font-semibold text-white transition duration-300" 
            href="#plans"
            onClick={closeMenu}
          >
            Plans
          </a>
        </li>
        <li className="relative whitespace-nowrap py-2 px-3">
          <a 
            className="nav-link scrollto flex items-center justify-between p-0 text-sm uppercase font-semibold text-white transition duration-300" 
            href="#team"
            onClick={closeMenu}
          >
            Team
          </a>
        </li>
        <li className="relative whitespace-nowrap py-2 px-3">
          <a 
            className="nav-link scrollto flex items-center justify-between p-0 text-sm uppercase font-semibold text-white transition duration-300" 
            href="#contact"
            onClick={closeMenu}
          >
            Contact
          </a>
        </li>
        <li className="relative whitespace-nowrap py-2 px-3 md:hidden">
          <Link 
            className="btn-get-started scrollto py-2 px-6 rounded text-white border-2 border-white hover:bg-[#fd3800] hover:border-[#ff4a17] transition duration-300" 
            href="/login"
            onClick={closeMenu}
          >
            SIGN IN
          </Link>
        </li>
      </ul>
      
      {/* Sign in button (visible only on desktop) */}
      <div className="hidden md:block">
        <Link 
          className="btn-get-started scrollto py-2 px-6 ml-8 rounded text-white border-2 border-white hover:bg-[#fd3800] hover:border-[#ff4a17] transition duration-300" 
          href="/login"
        >
          SIGN IN
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
