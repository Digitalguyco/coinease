"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";

export default function Withdraw() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("saved"); // "saved" or "new"
  const [selectedWallet, setSelectedWallet] = useState("");
  
  const [formData, setFormData] = useState({
    amount: "",
    networkChain: "ethereum",
    walletAddress: "",
    walletLabel: "", // For saving new wallets
    transactionPin: ""
  });

  // Dummy saved wallets data
  const savedWallets = [
    { id: "1", label: "My Ethereum Wallet", address: "0x1234...5678", network: "ethereum" },
    { id: "2", label: "Bitcoin Wallet", address: "bc1q...7ujm", network: "bitcoin" },
    { id: "3", label: "Litecoin Wallet", address: "ltc1q...9okm", network: "litecoin" }
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Introduce a delay for the loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Delay in milliseconds

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSavedWalletSelect = (e) => {
    const walletId = e.target.value;
    setSelectedWallet(walletId);
    
    if (walletId) {
      const wallet = savedWallets.find(w => w.id === walletId);
      setFormData({
        ...formData,
        networkChain: wallet.network,
        walletAddress: wallet.address
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to process the withdrawal
    console.log("Withdrawal requested:", formData);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Reset form
    setFormData({
      amount: "",
      networkChain: "ethereum",
      walletAddress: "",
      walletLabel: "",
      transactionPin: ""
    });
    setSelectedWallet("");
  };

  const closeModal = () => {
    setShowSuccessModal(false);
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
                        onClick={() => setWithdrawMethod("saved")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          withdrawMethod === "saved"
                            ? "bg-[#5B46F6] text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        Saved Wallets
                      </button>
                      <button
                        type="button"
                        onClick={() => setWithdrawMethod("new")}
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
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Available balance: $200,000
                      </p>
                    </div>

                    {withdrawMethod === "saved" ? (
                      /* Saved Wallets Dropdown */
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="savedWallet" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Select Wallet
                        </label>
                        <select
                          id="savedWallet"
                          value={selectedWallet}
                          onChange={handleSavedWalletSelect}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select a wallet</option>
                          {savedWallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>
                              {wallet.label} ({wallet.network})
                            </option>
                          ))}
                        </select>
                        
                        {selectedWallet && (
                          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Network: </span>
                              {formData.networkChain}
                            </p>
                            <p className="text-sm truncate">
                              <span className="font-medium">Address: </span>
                              {formData.walletAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* New Wallet Form */
                      <>
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
                        
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="networkChain" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select Network
                          </label>
                          <select
                            name="networkChain"
                            id="networkChain"
                            value={formData.networkChain}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          >
                            <option value="ethereum">Ethereum</option>
                            <option value="bitcoin">Bitcoin</option>
                            <option value="litecoin">Litecoin</option>
                            <option value="ripple">Ripple</option>
                            <option value="bitcoin-cash">Bitcoin Cash</option>
                            <option value="dash">Dash</option>
                          </select>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="walletAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Wallet Address
                          </label>
                          <input
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={formData.walletAddress}
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
                    >
                      Withdraw Funds
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
                    Ensure your wallet address is correct before submitting.
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
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your withdrawal request has been successfully submitted and is being processed.
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
