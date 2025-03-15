"use client";
import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Create a loading component for the Suspense fallback
const LoginLoading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5B46F6]"></div>
  </div>
);

// Create a client component for the login content
const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectToPath, setRedirectToPath] = useState<string | null>(null);
  
  console.log("Login page render - isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
  
  // Check if user is already authenticated
  useEffect(() => {
    // Get the 'from' param (the page the user was trying to access)
    const from = searchParams.get('from');
    const redirectPath = from || "/dashboard";
    setRedirectToPath(redirectPath);
    
    console.log("Login effect - isAuthenticated:", isAuthenticated, "redirect to:", redirectPath);
    
    // If user is already authenticated, redirect them
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to:", redirectPath);
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Clear error when user types
    if (error) {
      setError("");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      console.log("Submitting login form");
      // Call login function from auth context
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);
      
      if (result.success) {
        console.log("Login successful, redirecting to:", redirectToPath);
        // Redirect after successful login
        window.location.href = redirectToPath || "/dashboard"; // Forcing a full page redirect
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
        
        {/* Error Message */}
        {error && (
          <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[500px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:gap-4 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[500px] rounded-md"
        >
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
          <label htmlFor="password" className="text-sm sm:text-base md:text-lg font-bold font-inter mt-2">
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
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#5B46F6] text-white p-3 sm:p-4 md:p-6 w-full sm:w-[70%] md:w-[60%] lg:w-[50%] mt-4 self-center text-sm sm:text-base md:text-lg font-bold hover:bg-[#5B46F6]/80 transition-all duration-300 rounded-xl sm:rounded-2xl ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Login
              </div>
            ) : 'Login'}
          </button>
          
          <div className="self-end mt-2 text-xs sm:text-sm text-[#5B46F6] hover:underline cursor-pointer">
            Forgot password?
          </div>
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
};

// Main component with Suspense
export default function Login() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
