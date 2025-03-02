import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('#navbar') && !event.target.closest('#mobile-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset for navbar height
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Mobile menu toggle button */}
      <button 
        id="mobile-toggle"
        className="lg:hidden absolute right-4 top-4 z-50 text-[#5B46F6]"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <nav id="navbar" className={`navbar flex flex-col lg:flex-row lg:justify-around lg:items-end w-full ${isMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo - always visible */}
        <div className="text-2xl text-black dark:text-white font-bold flex gap-0.5 mx-12 my-4 lg:my-0 ">
          Coin <span className="text-[#5B46F6]">Ease</span>
        </div>

        {/* Navigation links - hidden on mobile unless menu is open */}
        <ul className={`
          flex flex-col lg:flex-row lg:justify-between lg:gap-10 lg:items-center lg:mr-auto
          gap-6 p-6 lg:p-0 
          ${isMenuOpen ? 'flex' : 'hidden lg:flex'}
        `}>
          <li>
            <button 
              onClick={() => scrollToSection('hero')} 
              className="relative hover:text-[#5B46F6] transition-colors duration-300 text-black dark:text-white
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              Home  
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="relative hover:text-[#5B46F6] transition-colors duration-300 text-black dark:text-white
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              Plans
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('about')} 
              className="relative hover:text-[#5B46F6] transition-colors duration-300 text-black dark:text-white
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              About Us
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="relative hover:text-[#5B46F6] transition-colors duration-300 text-black dark:text-white
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Auth buttons - hidden on mobile unless menu is open */}
        <div className={`
          flex flex-col lg:flex-row lg:justify-center lg:gap-10 lg:items-center lg:bg-[#5B46F6] lg:w-1/2 lg:h-full
          gap-4 p-6 lg:p-0 
          ${isMenuOpen ? 'flex' : 'hidden lg:flex'}
        `}>
          <Link 
            href="/login" 
            className="text-center lg:text-white text-[#5B46F6] hover:scale-105 transition-transform duration-300"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="text-center bg-white text-[#5B46F6] px-4 py-4 mt-1 rounded-md hover:shadow-lg hover:shadow-[#5B46F6]/30 hover:-translate-y-1 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* Mobile menu panel */}
      <div className={`
        fixed top-0 right-0 h-screen w-[80%] max-w-sm bg-white z-30 shadow-xl
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="pt-16 pb-6 px-6">
          <div className="text-2xl font-bold flex gap-0.5 mb-8 text-black ">
            Coin <span className="text-[#5B46F6]">Ease</span>
          </div>
          
          <ul className="flex flex-col gap-6 mb-8">
            <li>
              <button 
                onClick={() => scrollToSection('hero')} 
                className="relative  hover:text-[#5B46F6] transition-colors duration-300 
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                  after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="relative  hover:text-[#5B46F6] transition-colors duration-300 
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                  after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
              >
                Plans
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('about')} 
                className="relative  hover:text-[#5B46F6] transition-colors duration-300 
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                  after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="relative  hover:text-[#5B46F6] transition-colors duration-300 
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#5B46F6] 
                  after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
              >
                Contact
              </button>
            </li>
          </ul>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/login" 
              className="text-center text-[#5B46F6] hover:scale-105 transition-transform duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="text-center bg-[#5B46F6] text-white px-4 py-4 rounded-md hover:shadow-lg hover:shadow-[#5B46F6]/30 hover:-translate-y-1 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
