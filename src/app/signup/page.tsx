"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    networkChain: "ethereum",
    walletAddress: "",
    accountPlan: "Not sure yet",
    transactionPin: "",
    confirmTransactionPin: ""
  });

  const totalSteps = 5; // Total number of pages

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form submission here
    console.log("Form submitted:", formData);
    // You would typically send this data to your backend
  };

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
          href="/login"
          className="text-center bg-[#5B46F6] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-4 mt-1 rounded-md hover:shadow-lg hover:shadow-[#5B46F6]/30 hover:-translate-y-1 transition-all duration-300 text-xs sm:text-sm md:text-base"
        >
          Login
        </Link>
      </header>
      
      <section className="flex justify-between flex-col items-center gap-6 sm:gap-8 md:gap-10 lg:gap-20 p-4 sm:p-6 md:p-10 lg:p-20">
        <div className="flex flex-col gap-2 sm:gap-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
          <div className="text-center text-xl sm:text-2xl md:text-3xl font-bold font-inter">
            Create your account
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-500">
            Access all Coin<span className="text-[#5B46F6]">Ease</span> has to
            offer with a single account
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] mb-2 sm:mb-4">
          <div className="flex items-center w-full">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-full transition-colors duration-300 ${
                    index + 1 <= currentStep ? "bg-[#5B46F6] text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div 
                    className={`flex-1 h-1 mx-1 sm:mx-2 transition-colors duration-300 ${
                      index + 1 < currentStep ? "bg-[#5B46F6]" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:gap-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] px-2 sm:px-4 md:px-0 rounded-md"
        >
          {/* Step 1: Name and Email */}
          {currentStep === 1 && (
            <>
              <label htmlFor="fullName" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
              <label htmlFor="email" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
            </>
          )}

          {/* Step 2: Password */}
          {currentStep === 2 && (
            <>
              <label htmlFor="password" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
              <label htmlFor="confirmPassword" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
            </>
          )}

          {/* Step 3: Wallet Information */}
          {currentStep === 3 && (
            <>
              <label htmlFor="networkChain" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Select your smart network chain
              </label>
              <select
                id="networkChain"
                value={formData.networkChain}
                onChange={handleChange}
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              >
                <option value="ethereum">Ethereum</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="litecoin">Litecoin</option>
                <option value="ripple">Ripple</option>
                <option value="bitcoin-cash">Bitcoin Cash</option>
                <option value="dash">Dash</option>
              </select>
              <label htmlFor="walletAddress" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Wallet Address
              </label>
              <input
                type="text"
                id="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="Enter your wallet address"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
            </>
          )}

          {/* Step 4: Account Plan */}
          {currentStep === 4 && (
            <>
              <label htmlFor="accountPlan" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Account Plan (optional)
              </label>
              <select
                id="accountPlan"
                value={formData.accountPlan}
                onChange={handleChange}
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
              >
                <option value="Not sure yet">Not sure yet</option>
                <option value="Starter ~ SILVER">Starter ~ SILVER</option>
                <option value="Starter ~ GOLD">Starter ~ GOLD</option>
                <option value="Starter ~ PLATINUM">Starter ~ PLATINUM</option>
                <option value="Pro ~ SILVER">Pro ~ SILVER</option>
                <option value="Pro ~ GOLD">Pro ~ GOLD</option>
                <option value="Pro ~ PLATINUM">Pro ~ PLATINUM</option>
              </select>
              <div className="h-[70px] sm:h-[88px]"></div> {/* Spacer to maintain consistent height */}
            </>
          )}

          {/* Step 5: Transaction PIN */}
          {currentStep === 5 && (
            <>
              <label htmlFor="transactionPin" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Transaction Pin
              </label>
              <input
                type="password"
                id="transactionPin"
                value={formData.transactionPin}
                onChange={handleChange}
                placeholder="Enter your transaction pin"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
              <label htmlFor="confirmTransactionPin" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Confirm Transaction Pin
              </label>
              <input
                type="password"
                id="confirmTransactionPin"
                value={formData.confirmTransactionPin}
                onChange={handleChange}
                placeholder="Confirm your transaction pin"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
                required
              />
            </>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4 sm:mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="bg-gray-300 text-gray-800 p-2 sm:p-3 md:p-4 w-[100px] sm:w-[120px] text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl hover:bg-gray-400 transition-all duration-300"
              >
                Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className={`bg-[#5B46F6] text-white p-2 sm:p-3 md:p-4 w-[100px] sm:w-[120px] text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl hover:bg-[#5B46F6]/80 transition-all duration-300 ${currentStep === 1 ? 'ml-auto' : ''}`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#5B46F6] text-white p-2 sm:p-3 md:p-4 w-[100px] sm:w-[120px] text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl hover:bg-[#5B46F6]/80 transition-all duration-300"
              >
                Sign Up
              </button>
            )}
          </div>
        </form>
        <div className="flex flex-col gap-2 sm:gap-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] px-4 sm:px-0">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            By creating an account you certify that you are over the age of 18 and agree to the
            <Link href="/" className="text-[#5B46F6]">
              {" "}
              Privacy Policy
            </Link>{" "}
          </div>
        </div>
      </section>
    </>
  );
}
