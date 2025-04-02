"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function Withdraw() {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: "",
    currency: "ETH",
    withdrawal_address: "",
    withdrawal_network: "ethereum",
    walletLabel: "", // For display purposes only, not sent to API
    transactionPin: ""
  });

  // Network to currency mapping
  const networkToCurrency = {
    ethereum: "ETH",
    bitcoin: "BTC",
    litecoin: "LTC",
    ripple: "XRP",
    "bitcoin-cash": "BCH",
    dash: "DASH"
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://coinease.live/api/accounts/balance/', {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing the network, also update the currency
    if (name === "withdrawal_network") {
      setFormData({ 
        ...formData, 
        [name]: value,
        currency: networkToCurrency[value] || "ETH"
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrorMessage("");
    
    // Validate all required fields
    if (!formData.amount) {
      setErrorMessage("Please enter an amount to withdraw");
      return;
    }
    
    if (!formData.withdrawal_address) {
      setErrorMessage("Please enter a wallet address");
      return;
    }
    
    if (!formData.transactionPin) {
      setErrorMessage("Please enter your transaction PIN");
      return;
    }
    
    setIsSubmitting(true);
    
    // Validate amount against balance
    if (parseFloat(formData.amount) > userBalance) {
      setErrorMessage("Insufficient balance for this withdrawal");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Prepare data for API
      const withdrawalData = {
        amount: formData.amount,
        currency: formData.currency,
        withdrawal_address: formData.withdrawal_address,
        withdrawal_network: formData.withdrawal_network,
        withdrawal_method: "crypto",
        transaction_pin: formData.transactionPin
      };
      
      // Call the API
      const response = await axios.post(
        'https://coinease.live/api/transactions/withdrawals/create/',
        withdrawalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Store success data for display in modal
      setSuccessData({
        amount: formData.amount,
        currency: formData.currency,
        address: formData.withdrawal_address
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        amount: "",
        currency: "ETH",
        withdrawal_address: "",
        withdrawal_network: "ethereum",
        walletLabel: "",
        transactionPin: ""
      });
      
      // Update the user balance after successful withdrawal
      setUserBalance(prevBalance => prevBalance - parseFloat(formData.amount));
      
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || "An error occurred during withdrawal");
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
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
            <div className="container mx-auto max-w-4xl">
              <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>
              
              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{errorMessage}</p>
                </div>
              )}
              
              {/* Withdraw Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                  {/* Balance Display */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
                      <p className="text-2xl font-bold">${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.01"
                        min="10"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Minimum withdrawal: $10.00</p>
                  </div>
                  
                  {/* Network Selection */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="withdrawal_network" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Withdrawal Network
                    </label>
                    <select
                      name="withdrawal_network"
                      id="withdrawal_network"
                      value={formData.withdrawal_network}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="ethereum">Ethereum (ETH)</option>
                      <option value="bitcoin">Bitcoin (BTC)</option>
                      <option value="litecoin">Litecoin (LTC)</option>
                      <option value="ripple">Ripple (XRP)</option>
                      <option value="bitcoin-cash">Bitcoin Cash (BCH)</option>
                      <option value="dash">Dash (DASH)</option>
                    </select>
                  </div>
                  
                  {/* Wallet Label */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="walletLabel" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Wallet Label (optional)
                    </label>
                    <input
                      type="text"
                      name="walletLabel"
                      id="walletLabel"
                      value={formData.walletLabel}
                      onChange={handleChange}
                      placeholder="e.g. My Ethereum Wallet"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  {/* Wallet Address */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="withdrawal_address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      name="withdrawal_address"
                      id="withdrawal_address"
                      value={formData.withdrawal_address}
                      onChange={handleChange}
                      placeholder="Enter wallet address"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Please double-check your wallet address before submission.
                    </p>
                  </div>
                  
                  {/* Transaction PIN */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="transactionPin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transaction PIN
                    </label>
                    <input
                      type="password"
                      name="transactionPin"
                      id="transactionPin"
                      value={formData.transactionPin}
                      onChange={handleChange}
                      placeholder="Enter your transaction PIN"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  {/* Withdraw Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      isSubmitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-[#5B46F6] hover:bg-indigo-700"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Withdraw Funds"}
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    By proceeding, you agree to our withdrawal terms and conditions.
                  </p>
                </form>
              </div>
              
              {/* Info Card */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Important Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Withdrawals are processed within 24 hours.</li>
                  <li>Always double-check your wallet address before submitting.</li>
                  <li>Make sure you're using the correct network for your wallet.</li>
                  <li>Minimum withdrawal amount is $10.00.</li>
                  <li>A small network fee may apply to your withdrawal.</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Withdrawal Successful</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Your withdrawal request has been submitted successfully.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="font-medium">${successData?.amount} {successData?.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">To Address</span>
                <span className="font-medium text-xs truncate max-w-[200px]">{successData?.address}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Please allow up to 24 hours for the transaction to be processed.
            </p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-[#5B46F6] hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Suspense>
  );
}
