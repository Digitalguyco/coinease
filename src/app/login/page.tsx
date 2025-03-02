import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-3 sm:py-5">
        <Link
          href="/"
          className="text-lg sm:text-xl md:text-2xl font-bold flex gap-0.5 mx-2 sm:mx-4 md:mx-12 my-2 md:my-4 lg:my-0"
        >
          Coin <span className="text-[#5B46F6]">Ease</span>
        </Link>
        <Link
          href="/signup"
          className="text-center bg-[#5B46F6] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-4 mt-1 rounded-md hover:shadow-lg hover:shadow-[#5B46F6]/30 hover:-translate-y-1 transition-all duration-300 text-xs sm:text-sm md:text-base"
        >
          Sign Up
        </Link>
      </header>
      
      <section className="flex justify-between flex-col items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 p-6 sm:p-10 md:p-16 lg:p-20">
        <div className="text-center text-xl sm:text-2xl md:text-3xl font-bold font-inter">
          Sign In to Coin <span className="text-[#5B46F6]">Ease</span>
        </div>
        
        <form className="flex flex-col gap-3 sm:gap-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[500px] rounded-md">
          <label htmlFor="email" className="text-sm sm:text-base md:text-lg font-bold font-inter">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
          />
          <label htmlFor="password" className="text-sm sm:text-base md:text-lg font-bold font-inter mt-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
          />
          <button
            type="submit"
            className="bg-[#5B46F6] text-white p-3 sm:p-4 md:p-6 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] mt-4 self-center text-sm sm:text-base md:text-lg font-bold hover:bg-[#5B46F6]/80 transition-all duration-300 rounded-xl sm:rounded-2xl"
          >
            Login
          </button>
          
          {/* <div className="self-end mt-2 text-xs sm:text-sm text-[#5B46F6] hover:underline cursor-pointer">
            Forgot password?
          </div> */}
        </form>
        
        <div className="flex flex-col gap-2 sm:gap-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[500px] px-4 sm:px-0">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            Not your device? Use a private window. See our{" "}
            <Link href="/" className="text-[#5B46F6] hover:underline">
              Privacy Policy
            </Link>{" "}
            for more info.
          </div>
        </div>
      </section>
    </>
  );
}
