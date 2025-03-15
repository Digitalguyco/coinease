"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// 1. Create a client component to handle the search params
const InvestmentContent = () => {
  const searchParams = useSearchParams();
  const preselectedPlanId = searchParams?.get('plan');
  
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlanType, setSelectedPlanType] = useState('starter'); // 'starter' or 'pro'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30'); // Default duration in days
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:9000/api/accounts/balance/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.balance !== undefined) {
          setUserBalance(parseFloat(response.data.balance));
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };

    fetchUserBalance();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Fetch investment plans
  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        setPlansLoading(true);
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.get('http://localhost:9000/api/transactions/investment-plans/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setInvestmentPlans(response.data);
        
        // If there's a preselected plan ID from URL parameters, select it
        if (preselectedPlanId) {
          const plan = response.data.find(p => p.id.toString() === preselectedPlanId);
          if (plan) {
            setSelectedPlanType(plan.tier.toLowerCase());
            setSelectedPlan(plan);
            setDuration(plan.duration.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching investment plans:", error);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchInvestmentPlans();
  }, [preselectedPlanId]);

  const filteredPlans = investmentPlans.filter(
    plan => plan.tier.toLowerCase() === selectedPlanType
  );

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setDuration(plan.duration.toString());
  };

  const calculateReturns = () => {
    if (!selectedPlan || !amount) return null;
    
    const investmentAmount = parseFloat(amount);
    const dailyROI = selectedPlan.daily_roi / 100;
    const days = parseInt(duration);
    
    const totalReturn = investmentAmount + (investmentAmount * dailyROI * days);
    const profit = totalReturn - investmentAmount;
    
    return {
      totalReturn: totalReturn.toFixed(2),
      profit: profit.toFixed(2),
      dailyProfit: (investmentAmount * dailyROI).toFixed(2)
    };
  };

  const handleInvestClick = () => {
    if (!selectedPlan) {
      setErrorMessage("Please select an investment plan");
      return;
    }

    const investmentAmount = parseFloat(amount);
    
    // Validate minimum and maximum deposit
    if (investmentAmount < selectedPlan.min_deposit) {
      setErrorMessage(`Minimum deposit amount for this plan is $${selectedPlan.min_deposit}`);
      return;
    }
    
    if (investmentAmount > selectedPlan.max_deposit) {
      setErrorMessage(`Maximum deposit amount for this plan is $${selectedPlan.max_deposit}`);
      return;
    }
    
    // Validate user balance
    if (investmentAmount > userBalance) {
      setErrorMessage("Insufficient balance for this investment");
      return;
    }
    
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const createInvestment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const token = localStorage.getItem('accessToken');
      
      const investmentData = {
        plan_id: selectedPlan.id,
        amount: parseFloat(amount),
        currency: "USD" // Assuming USD as the default currency
      };
      
      const response = await axios.post(
        'http://localhost:9000/api/transactions/investments/create/',
        investmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Store success data
      setSuccessData({
        planName: `${selectedPlan.tier} ${selectedPlan.level} Plan`,
        amount: parseFloat(amount),
        returns: calculateReturns()
      });
      
      // Close confirmation modal and show success modal
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      // Update the user balance after successful investment
      setUserBalance(prevBalance => prevBalance - parseFloat(amount));
      
      // Reset form
      setAmount('');
      
    } catch (error) {
      console.error("Error creating investment:", error);
      setShowConfirmModal(false);
      
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || "An error occurred while creating your investment");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Drawer Navigation */}
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Investment Plans</h1>
              <Link 
                href="/dashboard/myinvestments" 
                className="px-4 py-2 flex items-center bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Investments
              </Link>
            </div>
            
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{errorMessage}</p>
              </div>
            )}
            
            {/* Available Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
                  <p className="text-2xl font-bold">${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="flex space-x-3">
                  <Link 
                    href="/dashboard/myinvestments" 
                    className="px-4 py-2 mr-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    My Investments
                  </Link>
                  <a 
                    href="/dashboard/deposit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Add Funds
                  </a>
                </div>
              </div>
            </div>
            
            {/* Plan Type Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Select Plan Type</h2>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedPlanType('starter')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPlanType === 'starter'
                        ? "bg-white dark:bg-gray-800 shadow-sm"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Starter Plans
                  </button>
                  <button
                    onClick={() => setSelectedPlanType('pro')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPlanType === 'pro'
                        ? "bg-white dark:bg-gray-800 shadow-sm"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Pro Plans
                  </button>
                </div>
              </div>
              
              {/* Plan Cards */}
              {plansLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredPlans.map(plan => (
                    <div 
                      key={plan.id} 
                      className={`border rounded-xl p-4 transition-colors cursor-pointer ${
                        selectedPlan?.id === plan.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                      }`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <h3 className="font-medium text-lg">{plan.tier.toUpperCase()} {plan.level.toUpperCase()}</h3>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 my-2">
                        {plan.daily_roi}% <span className="text-sm font-normal text-gray-500 dark:text-gray-400">daily ROI</span>
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Min: ${plan.min_deposit}
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Max: ${plan.max_deposit}
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Duration: {plan.duration} days
                        </li>
                      </ul>
                      <button
                        type="button"
                        className={`w-full py-2 px-4 rounded-lg text-center text-sm font-medium ${
                          selectedPlan?.id === plan.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No investment plans available for this type
                </div>
              )}
            </div>
            
            {/* Investment Form */}
            {selectedPlan && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Create Investment</h2>
                <form className="space-y-6">
                  {/* Selected Plan */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Selected Plan
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium">{selectedPlan.tier} {selectedPlan.level} Plan</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPlan.roi}% daily ROI • Min: ${selectedPlan.min_deposit} • Max: ${selectedPlan.max_deposit}
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount Field */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        placeholder="0.00"
                        min={selectedPlan.min_deposit}
                        max={selectedPlan.max_deposit}
                        className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Min: ${selectedPlan.min_deposit} • Max: ${selectedPlan.max_deposit} • Available: ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  {/* If we have returns calculated, show them */}
                  {amount && parseFloat(amount) > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expected Returns (in {duration} days)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-green-500 dark:text-green-400">Daily Profit</p>
                          <p className="font-bold text-lg">${calculateReturns()?.dailyProfit}</p>
                        </div>
                        <div>
                          <p className="text-green-500 dark:text-green-400">Total Profit</p>
                          <p className="font-bold text-lg">${calculateReturns()?.profit}</p>
                        </div>
                        <div>
                          <p className="text-green-500 dark:text-green-400">Total Return</p>
                          <p className="font-bold text-lg">${calculateReturns()?.totalReturn}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invest Button */}
                  <button
                    type="button"
                    onClick={handleInvestClick}
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    Invest Now
                  </button>
                </form>
              </div>
            )}
            
            {/* Investment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Investment Information</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-indigo-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Profits are added to your balance daily.
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-indigo-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  You can have multiple active investments at the same time.
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-indigo-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Principal amount is returned at the end of the investment period.
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-indigo-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Higher tier plans offer better ROI but require larger investments.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirm Investment</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You are about to invest <span className="font-semibold">${amount}</span> in the <span className="font-semibold">{selectedPlan?.tier} {selectedPlan?.level} Plan</span>.
                <br/><br/>
                {calculateReturns() && (
                  <>
                    Expected profit: <span className="font-semibold">${calculateReturns()?.profit}</span> over {duration} days.
                    <br/>
                    Daily profit: <span className="font-semibold">${calculateReturns()?.dailyProfit}</span>
                  </>
                )}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={closeModals}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createInvestment}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Investment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Investment Successful!</h3>
              {successData && (
                <div className="text-gray-600 dark:text-gray-400 mb-6">
                  <p className="mb-2">
                    You have successfully invested <span className="font-semibold">${successData.amount}</span> in the <span className="font-semibold">{successData.planName}</span>.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Returns</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Daily Profit:</span>
                        <span className="font-semibold">${successData.returns?.dailyProfit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Profit:</span>
                        <span className="font-semibold">${successData.returns?.profit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Return:</span>
                        <span className="font-semibold">${successData.returns?.totalReturn}</span>
                      </div>
                    </div>
                  </div>
                  <p>
                    You can view your active investments in the Investments section.
                  </p>
                </div>
              )}
              <button
                onClick={closeModals}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Modify your main component to use Suspense properly
export default function Invest() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InvestmentContent />
    </Suspense>
  );
}