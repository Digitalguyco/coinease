"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Define our API base URL - update this with your backend URL
import { API_URL } from "@/app/constants";

export default function Signup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    transactionPin: "",
    confirmTransactionPin: ""
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    transactionPin: "",
    confirmTransactionPin: ""
  });

  const totalSteps = 4; // Total number of pages (reduced by 1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Clear error for this field when user types
    if (formErrors[id as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [id]: ""
      });
    }
  };

  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };

    switch (step) {
      case 1:
        // Validate name and email
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required";
          isValid = false;
        }
        
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid";
          isValid = false;
        }
        break;
        
      case 2:
        // Validate password
        if (!formData.password) {
          newErrors.password = "Password is required";
          isValid = false;
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
          isValid = false;
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
          isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
          isValid = false;
        }
        break;
        
      case 4:
        // Validate transaction PIN (shifted from Step 4 to Step 3)
        if (!formData.transactionPin.trim()) {
          newErrors.transactionPin = "Transaction PIN is required";
          isValid = false;
        } else if (formData.transactionPin.length !== 4 || !/^\d+$/.test(formData.transactionPin)) {
          newErrors.transactionPin = "Transaction PIN must be 4 digits";
          isValid = false;
        }
        
        if (!formData.confirmTransactionPin.trim()) {
          newErrors.confirmTransactionPin = "Please confirm your transaction PIN";
          isValid = false;
        } else if (formData.transactionPin !== formData.confirmTransactionPin) {
          newErrors.confirmTransactionPin = "Transaction PINs don't match";
          isValid = false;
        }
        break;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      console.log(currentStep);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
      setError(""); // Clear any previous errors
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0); // Scroll to top when changing steps
      setError(""); // Clear any previous errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate final step
    if (!validateStep(currentStep)) {
      return;
    }
    
    // Prepare data for API
    const registerData = {
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      referral_code: formData.referralCode || undefined, // Only send if provided
      transaction_pin: formData.transactionPin
    };
    
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_URL}/register/`, registerData);
      
      setSuccess("Registration successful! Redirecting to login...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific error messages from backend
        if (error.response.data.error) {
          setError(error.response.data.error);
        } else if (typeof error.response.data === 'object') {
          // Handle validation errors that might be in different format
          const firstError = Object.values(error.response.data)[0];
          setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // check if user is already authenticated
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    router.push("/dashboard");
  }

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

        {/* Error and Success Messages */}
        {error && (
          <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

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
                className={`p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 ${
                  formErrors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
              )}
              
              <label htmlFor="email" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
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
                className={`p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
              
              <label htmlFor="confirmPassword" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 ${
                  formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </>
          )}

          
          {/* Step 3: Referral Code */}
          {currentStep === 3 && (
            <>
              <label htmlFor="referralCode" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Referral Code (optional)
              </label>
              <input
                type="text"
                id="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Enter your referral code"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
              />
              
              <div className="h-[70px] sm:h-[88px]"></div> {/* Spacer to maintain consistent height */}
            </>
          )}

          {/* Step 4: Transaction PIN */}
          {currentStep === 4 && (
            <>
              <label htmlFor="transactionPin" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Transaction PIN
              </label>
              <input
                type="password"
                id="transactionPin"
                value={formData.transactionPin}
                maxLength={4}
                onChange={handleChange}
                placeholder="Enter your transaction PIN"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
              />
              <label htmlFor="confirmTransactionPin" className="text-sm sm:text-base md:text-lg font-bold font-inter">
                Confirm Transaction PIN
              </label>
              <input
                type="password"
                id="confirmTransactionPin"
                value={formData.confirmTransactionPin}
                maxLength={4}
                onChange={handleChange}
                placeholder="Confirm your transaction PIN"
                className="p-3 sm:p-4 md:p-6 text-sm sm:text-base rounded-md border-2 border-gray-300"
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
                disabled={loading}
                className={`bg-[#5B46F6] text-white p-2 sm:p-3 md:p-4 w-[100px] sm:w-[120px] text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl hover:bg-[#5B46F6]/80 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sign Up
                  </div>
                ) : (
                  'Sign Up'
                )}
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
