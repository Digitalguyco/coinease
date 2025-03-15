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
  const [withdrawMethod, setWithdrawMethod] = useState("saved"); // "saved" or "new"
  const [selectedWallet, setSelectedWallet] = useState("");
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

  // Get user's default wallet from localStorage (if available)
  const getUserWallet = () => {
    var wallet_address = "";
    var wallet_network = "";
    try {
      const userData = localStorage.getItem('userData' );
      if (userData) {
        const user = JSON.parse(userData);
        wallet_address = user.wallet_address;
        wallet_network = user.wallet_network;
      }
    } catch (error) {
      console.error("Error parsing wallet from localStorage:", error);
    }
    return { address: wallet_address, network: wallet_network };
  };

  // Get user wallet
  const defaultWallet = getUserWallet();
  console.log(defaultWallet);

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
    console.log();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Initialize form with default wallet if using saved method
  useEffect(() => {
    console.log(withdrawMethod, defaultWallet.address);
    if (withdrawMethod === "saved" && defaultWallet.address) {
      console.log('tss')
      setFormData({
        ...formData,
        withdrawal_address: defaultWallet.address,
        withdrawal_network: defaultWallet.network || "ethereum",
        currency: networkToCurrency[defaultWallet.network || "ethereum"]
      });
    }
  }, [withdrawMethod]);

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
        '"https://coinease.live/api/transactions/withdrawals/create/',
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
      setSelectedWallet("");
      
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
                <div className="flex flex-col space-y-6">
                  {/* Withdraw Method Toggle */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Withdraw Method
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawMethod("saved");
                          // Reset form and pre-fill with default wallet
                          if (defaultWallet.address) {
                            setFormData({
                              ...formData,
                              withdrawal_address: defaultWallet.address,
                              withdrawal_network: defaultWallet.network || "ethereum",
                              currency: networkToCurrency[defaultWallet.network || "ethereum"]
                            });
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          withdrawMethod === "saved"
                            ? "bg-[#5B46F6] text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        Default Wallet
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWithdrawMethod("new");
                          // Reset form fields for new wallet
                          setFormData({
                            ...formData,
                            withdrawal_address: "",
                            withdrawal_network: "ethereum",
                            currency: "ETH",
                            walletLabel: ""
                          });
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          withdrawMethod === "new"
                            ? "bg-[#5B46F6] text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        New Wallet
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Field */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                          min="50"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Available balance: ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    {withdrawMethod === "saved" ? (
                      /* Default Wallet Display */
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Default Wallet
                        </label>
                        
                        {defaultWallet.address ? (
                          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Network: </span>
                              {defaultWallet.network || "ethereum"}
                            </p>
                            <p className="text-sm break-all">
                              <span className="font-medium">Address: </span>
                              {defaultWallet.address}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-800 dark:text-yellow-200">
                            <p className="text-sm">
                              No default wallet found. Please use the "New Wallet" option.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* New Wallet Form */
                      <>
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="walletLabel" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Wallet Label (for your reference only)
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
                        
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="withdrawal_network" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Network
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
                        </div>
                      </>
                    )}
                    
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
                      className="w-full py-3 px-4 bg-[#5B46F6] text-white font-medium rounded-lg hover:bg-[#5B46F6]/90 transition-all duration-200"
                      disabled={isSubmitting || !formData.withdrawal_address}
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
                        "Withdraw Funds"
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Withdrawal Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Withdrawal Information</h2>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Withdrawals are processed within 24 hours.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Minimum withdrawal amount: $50.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Ensure your wallet address is correct before submitting. We cannot recover funds sent to incorrect addresses.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Network fees will be deducted from your withdrawal amount.
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center text-center">
              {/* Success Checkmark Icon */}
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Withdrawal Successful!</h3>
              {successData && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  You have successfully withdrawn {successData.amount} {successData.currency} to {successData.address.substring(0, 10)}...{successData.address.substring(successData.address.length - 6)}.
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your withdrawal has been processed and the funds have been sent to your wallet.
              </p>
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-[#5B46F6] text-white font-medium rounded-lg hover:bg-[#5B46F6]/90 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
    </div>
      )}
    </Suspense>
  );
}
