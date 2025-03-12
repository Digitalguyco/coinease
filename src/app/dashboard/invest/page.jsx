"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";

export default function Invest() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState("starter");
  const [selectedPlanType, setSelectedPlanType] = useState(null); // "silver", "gold", "platinum"
  const [amount, setAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [investmentDetails, setInvestmentDetails] = useState(null);
  const [error, setError] = useState("");

  // Investment plans data
  const investmentPlans = {
    starter: {
      silver: {
        dailyROI: 2.8,
        minDeposit: 100,
        maxDeposit: 1000,
        duration: 7
      },
      gold: {
        dailyROI: 5.7,
        minDeposit: 1500,
        maxDeposit: 10000,
        duration: 7
      },
      platinum: {
        dailyROI: 8.5,
        minDeposit: 10000,
        maxDeposit: 50000,
        duration: 7
      }
    },
    pro: {
      silver: {
        dailyROI: 3.2,
        minDeposit: 60000,
        maxDeposit: 100000,
        duration: 14
      },
      gold: {
        dailyROI: 6.2,
        minDeposit: 80000,
        maxDeposit: 250000,
        duration: 14
      },
      platinum: {
        dailyROI: 9.2,
        minDeposit: 100000,
        maxDeposit: 500000,
        duration: 14
      }
    }
  };

  // Initialize the loading spinner delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const togglePlan = (plan) => {
    setActivePlan(plan);
    setSelectedPlanType(null); // Reset selected plan when toggling
    setAmount(""); // Reset amount
    setError(""); // Reset error
  };

  const handlePlanSelect = (planType) => {
    setSelectedPlanType(planType);
    setAmount(""); // Reset amount when changing plan
    setError(""); // Reset error
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError(""); // Clear any previous errors
  };

  const validateAndSubmit = () => {
    if (!selectedPlanType) {
      setError("Please select an investment plan");
      return;
    }

    const plan = investmentPlans[activePlan][selectedPlanType];
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum)) {
      setError("Please enter a valid amount");
      return;
    }

    if (amountNum < plan.minDeposit) {
      setError(`Minimum deposit amount is $${plan.minDeposit}`);
      return;
    }

    if (amountNum > plan.maxDeposit) {
      setError(`Maximum deposit amount is $${plan.maxDeposit}`);
      return;
    }

    // Calculate expected returns
    const dailyReturn = (amountNum * plan.dailyROI) / 100;
    const totalReturn = dailyReturn * plan.duration;

    // Set investment details for the confirmation modal
    setInvestmentDetails({
      planType: selectedPlanType.toUpperCase(),
      planTier: activePlan.toUpperCase(),
      amount: amountNum,
      dailyROI: plan.dailyROI,
      duration: plan.duration,
      dailyReturn,
      totalReturn,
      totalAmount: amountNum + totalReturn
    });

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmInvestment = () => {
    // Here you would typically make an API call to create the investment
    console.log("Investment confirmed:", investmentDetails);
    
    // Close modal and reset form
    setShowConfirmModal(false);
    setSelectedPlanType(null);
    setAmount("");
  };

  const cancelInvestment = () => {
    setShowConfirmModal(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex h-screen overflow-hidden">
        {/* Drawer Navigation */}
        <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <Header isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-6">Investment Plans</h1>

              {/* Plan Type Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-3xl h-11 flex items-center">
                  <div 
                    className={`px-4 md:px-6 py-[13px] rounded-[22px] cursor-pointer transition-all duration-300 ${
                      activePlan === "starter" 
                        ? "bg-[#5b46f6] text-white shadow-[0px_5px_7px_0px_rgba(82,67,194,0.23)]" 
                        : "text-[#5b46f6]"
                    }`}
                    onClick={() => togglePlan("starter")}
                  >
                    <div className="text-center text-xs font-medium font-inter tracking-wide">
                      STARTER
                    </div>
                  </div>
                  <div 
                    className={`px-4 md:px-6 py-[13px] rounded-[22px] cursor-pointer transition-all duration-300 ${
                      activePlan === "pro" 
                        ? "bg-[#5b46f6] text-white shadow-[0px_5px_7px_0px_rgba(82,67,194,0.23)]" 
                        : "text-[#5b46f6]"
                    }`}
                    onClick={() => togglePlan("pro")}
                  >
                    <div className="text-center text-xs font-medium font-inter tracking-wide">
                      PRO
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Plan Form */}
              {selectedPlanType && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedPlanType.toUpperCase()} Plan - {activePlan.toUpperCase()}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Daily ROI</p>
                      <p className="text-lg font-medium">{investmentPlans[activePlan][selectedPlanType].dailyROI}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Duration</p>
                      <p className="text-lg font-medium">{investmentPlans[activePlan][selectedPlanType].duration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Min Deposit</p>
                      <p className="text-lg font-medium">${investmentPlans[activePlan][selectedPlanType].minDeposit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Max Deposit</p>
                      <p className="text-lg font-medium">${investmentPlans[activePlan][selectedPlanType].maxDeposit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Investment Amount
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                  </div>

                  {amount && !error && parseFloat(amount) > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <h3 className="text-md font-medium mb-3">Estimated Returns</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Daily Return</p>
                          <p className="text-lg font-medium text-green-600 dark:text-green-400">
                            ${((parseFloat(amount) * investmentPlans[activePlan][selectedPlanType].dailyROI) / 100).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                          <p className="text-lg font-medium text-green-600 dark:text-green-400">
                            ${(((parseFloat(amount) * investmentPlans[activePlan][selectedPlanType].dailyROI) / 100) * investmentPlans[activePlan][selectedPlanType].duration).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setSelectedPlanType(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 bg-[#5B46F6] text-white rounded-lg hover:bg-[#5B46F6]/90 transition-all"
                      onClick={validateAndSubmit}
                    >
                      Invest Now
                    </button>
                  </div>
                </div>
              )}

              {/* Plans Grid */}
              {!selectedPlanType && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Silver Plan */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-3xl font-bold">
                        {investmentPlans[activePlan].silver.dailyROI}%{" "}
                        <span className="text-gray-500 text-xl font-medium">/day</span>
                      </div>
                      <div className="text-[#5b46f6] text-xl font-bold mt-2">SILVER</div>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4 mb-6">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">Min Deposit:</span> ${investmentPlans[activePlan].silver.minDeposit.toLocaleString()}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">Max Deposit:</span> ${investmentPlans[activePlan].silver.maxDeposit.toLocaleString()}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">ROI:</span> {investmentPlans[activePlan].silver.dailyROI}% Daily
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">Duration:</span> {investmentPlans[activePlan].silver.duration} Days
                          </div>
                        </li>
                      </ul>
                      <button
                        onClick={() => handlePlanSelect("silver")}
                        className="w-full py-3 bg-[#5b46f6]/80 hover:bg-[#5b46f6] text-white rounded-xl transition-colors duration-300"
                      >
                        Choose plan
                      </button>
                    </div>
                  </div>

                  {/* Gold Plan */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-3xl font-bold">
                        {investmentPlans[activePlan].gold.dailyROI}%{" "}
                        <span className="text-gray-500 text-xl font-medium">/day</span>
                      </div>
                      <div className="text-[#5b46f6] text-xl font-bold mt-2">GOLD</div>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4 mb-6">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">Min Deposit:</span> ${investmentPlans[activePlan].gold.minDeposit.toLocaleString()}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">Max Deposit:</span> ${investmentPlans[activePlan].gold.maxDeposit.toLocaleString()}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <span className="font-medium">ROI:</span> {investmentPlans[activePlan].gold.dailyROI}% Daily
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
    <div>
                            <span className="font-medium">Duration:</span> {investmentPlans[activePlan].gold.duration} Days
                          </div>
                        </li>
                      </ul>
                      <button
                        onClick={() => handlePlanSelect("gold")}
                        className="w-full py-3 bg-[#5b46f6]/80 hover:bg-[#5b46f6] text-white rounded-xl transition-colors duration-300"
                      >
                        Choose plan
                      </button>
                    </div>
                  </div>

                  {/* Platinum Plan - Featured */}
                  <div className="bg-[#231D4F] rounded-xl shadow-lg overflow-hidden relative">
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#5b46f6] text-white text-xs px-2 py-1 rounded-full">Popular</span>
                    </div>
                    <div className="p-6 border-b border-gray-700">
                      <div className="text-3xl font-bold text-white">
                        {investmentPlans[activePlan].platinum.dailyROI}%{" "}
                        <span className="text-gray-400 text-xl font-medium">/day</span>
                      </div>
                      <div className="text-[#5b46f6] text-xl font-bold mt-2">PLATINUM</div>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4 mb-6">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-white">
                            <span className="font-medium">Min Deposit:</span> ${investmentPlans[activePlan].platinum.minDeposit.toLocaleString()}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-white">
                            <span className="font-medium">Max Deposit:</span> ${investmentPlans[activePlan].platinum.maxDeposit.toLocaleString()}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-white">
                            <span className="font-medium">ROI:</span> {investmentPlans[activePlan].platinum.dailyROI}% Daily
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-white mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="text-white">
                            <span className="font-medium">Duration:</span> {investmentPlans[activePlan].platinum.duration} Days
                          </div>
                        </li>
                      </ul>
                      <button
                        onClick={() => handlePlanSelect("platinum")}
                        className="w-full py-3 bg-[#5b46f6] hover:bg-[#5b46f6]/90 text-white rounded-xl transition-colors duration-300"
                      >
                        Choose plan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Investment Information */}
              <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Investment Information</h2>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Returns are calculated daily and credited to your account automatically.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    After the investment duration ends, your principal amount is returned to your balance.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    You can have multiple active investments at the same time.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Pro plans offer higher returns but require longer commitment periods.
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && investmentDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirm Investment</h3>
            
            <div className="mb-6 space-y-4">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                <span className="font-medium">{investmentDetails.planType} - {investmentDetails.planTier}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium">${investmentDetails.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Daily ROI:</span>
                <span className="font-medium">{investmentDetails.dailyROI}%</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-medium">{investmentDetails.duration} days</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Daily Return:</span>
                <span className="font-medium text-green-600 dark:text-green-400">${investmentDetails.dailyReturn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Total Return:</span>
                <span className="font-medium text-green-600 dark:text-green-400">${investmentDetails.totalReturn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-medium">Total After Duration:</span>
                <span className="font-bold">${investmentDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelInvestment}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmInvestment}
                className="flex-1 py-2 px-4 bg-[#5B46F6] text-white font-medium rounded-lg hover:bg-[#5B46F6]/90"
              >
                Confirm
              </button>
            </div>
          </div>
    </div>
      )}
    </Suspense>
  );
}
