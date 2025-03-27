"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";
import QRCode from "react-qr-code";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
export default function Deposit() {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Amount, 2: Choose Network, 3: Pay, 4: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  // Crypto addresses
  const cryptoAddresses = {
    ethereum: "0x1e909025DfE84237bCd80a33BFe61040Cf570414",
    ripple: "rhPdu2abEnmvumEW6uGMYcro1pcshL2sxH",
    usdt: "0x1e909025DfE84237bCd80a33BFe61040Cf570414",
    bitcoin: "bc1qc7rv2k2k4u94zey4z4k9vfjt3lg8eqwtg4zxqn",
  };

  // Currency mapping for API
  const currencyMapping = {
    ethereum: "ETH",
    ripple: "XRP",
    usdt: "USDT",
    bitcoin: "BTC",
  };

  // Network display names
  const networkNames = {
    ethereum: "Ethereum (ETH)",
    ripple: "Ripple (XRP)",
    usdt: "Tether (USDT)",
    bitcoin: "Bitcoin (BTC)",
  };

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

  const handleAmountSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (depositAmount && parseFloat(depositAmount) >= 50) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else {
      setApiError("The minimum deposit amount is $50. Please enter a higher amount.");
    }
  };

  const handleNetworkSelect = (network: React.SetStateAction<string>) => {
    setSelectedNetwork(network);
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const handlePaymentConfirmation = async () => {
    setIsSubmitting(true);
    setApiError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken");

      // Create deposit object to send to API
      const data = {
        user: user,
        amount: parseFloat(depositAmount),
        currency:
          currencyMapping[selectedNetwork as keyof typeof currencyMapping],
        wallet_address:
          cryptoAddresses[selectedNetwork as keyof typeof cryptoAddresses],
        wallet_network: selectedNetwork,
        description: `Deposit of ${depositAmount} USD worth of ${
          currencyMapping[selectedNetwork as keyof typeof currencyMapping]
        }`,
      };

      // Make API call
      const response = await axios.post(
        "https://coinease.live/api/transactions/deposits/create/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Set transaction ID for reference
      if (response.data && response.data.id) {
        setTransactionId(response.data.id);
      }

      // Show pending modal
      setShowPendingModal(true);
    } catch (error) {
      console.error("Error creating deposit:", error);
      if (axios.isAxiosError(error) && error.response) {
        setApiError(
          error.response.data.error ||
            "An error occurred while processing your deposit."
        );
      } else {
        setApiError("Network error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep(1);
    setDepositAmount("");
    setSelectedNetwork("");
    setShowPendingModal(false);
    setTransactionId(null);
    setApiError("");
  };

  const closeModal = () => {
    setShowPendingModal(false);
    router.push("/dashboard/");
  };

  // Helper function to copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
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
              <h1 className="text-2xl font-bold mb-6">Deposit Funds</h1>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step
                            ? "bg-[#5B46F6] text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {step}
                      </div>
                      <span className="text-xs mt-2 text-center">
                        {step === 1
                          ? "Amount"
                          : step === 2
                          ? "Network"
                          : step === 3
                          ? "Payment"
                          : "Confirm"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#5B46F6] transition-all duration-300"
                    style={{ width: `${(currentStep - 1) * 33.33}%` }}
                  ></div>
                </div>
              </div>

              {/* Error display */}
              {apiError && (
                <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {apiError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content based on current step */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                {currentStep === 1 && (
                  <div className="flex flex-col space-y-6">
                    <h2 className="text-lg font-semibold">
                      Enter Deposit Amount
                    </h2>
                    <form onSubmit={handleAmountSubmit} className="space-y-6">
                      <div className="flex flex-col space-y-2">
                        <label
                          htmlFor="depositAmount"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Amount
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            id="depositAmount"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="0.00"
                            min="50"
                            step="0.01"
                            className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Minimum deposit amount: $50
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#5B46F6] text-white font-medium rounded-lg hover:bg-[#5B46F6]/90 transition-all duration-200"
                      >
                        Continue
                      </button>
                    </form>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col space-y-6">
                    <h2 className="text-lg font-semibold">
                      Select Payment Network
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You are depositing{" "}
                      <span className="font-semibold">${depositAmount}</span>.
                      Select the cryptocurrency network you would like to use
                      for your deposit.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(cryptoAddresses).map((network) => (
                        <button
                          key={network}
                          onClick={() => handleNetworkSelect(network)}
                          className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-10 h-10 mr-3 rounded-full bg-[#5B46F6]/10 flex items-center justify-center">
                            {network === "ethereum" && (
                              <svg viewBox="0 0 32 32" width="24" height="24">
                                <g fill="none" fillRule="evenodd">
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="16"
                                    fill="#627EEA"
                                  />
                                  <g fill="#FFF" fillRule="nonzero">
                                    <path
                                      fillOpacity=".602"
                                      d="M16.498 4v8.87l7.497 3.35z"
                                    />
                                    <path d="M16.498 4L9 16.22l7.498-3.35z" />
                                    <path
                                      fillOpacity=".602"
                                      d="M16.498 21.968v6.027L24 17.616z"
                                    />
                                    <path d="M16.498 27.995v-6.028L9 17.616z" />
                                    <path
                                      fillOpacity=".2"
                                      d="M16.498 20.573l7.497-4.353-7.497-3.348z"
                                    />
                                    <path
                                      fillOpacity=".602"
                                      d="M9 16.22l7.498 4.353v-7.701z"
                                    />
                                  </g>
                                </g>
                              </svg>
                            )}
                            {network === "ripple" && (
                              <svg viewBox="0 0 32 32" width="24" height="24">
                                <g fill="none">
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="16"
                                    fill="#23292F"
                                  />
                                  <path
                                    d="M22.71 11.6c-.47.07-1.75.21-3.16-.08a16.8 16.8 0 01-2.92-.67c-1.58-.46-3.28-1.03-4.67-.45-.95.39-1.59 1.15-1.92 2.31-1.38 4.94 2.69 9.74 4.3 12.28.18.28.33.53.45.73l.62 1.03c.08.14.16.28.25.42h3.34a.92.92 0 00-.08-.16l-.63-1.03c-.13-.2-.28-.46-.46-.75-1.52-2.37-5.32-8.99-4.28-12.89.17-.6.42-.84.73-.97.7-.29 1.72.1 2.9.54.54.2 1.1.4 1.68.57.92.26 1.72.51 2.33.51.7 0 1.13-.14 1.47-.26.13-.05.25-.09.36-.12a13.1 13.1 0 00-.31-.41zm.79-.86c.31.53.5.98.61 1.25.05.12.1.22.12.3.04.04.1.12.2.18.27.19.73.51.57 1.12a1.25 1.25 0 01-1.07.72c-.4.04-.76-.07-1.06-.16-.1-.03-.18-.06-.25-.07-.3-.06-.68-.14-1.13-.14l-.01 1.5c.65 0 1.16.11 1.52.19.06.01.1.03.14.04.36.1.85.25 1.55.18a2.75 2.75 0 002.3-1.58c.59-1.4-.5-2.25-.91-2.54l-.02-.02a5.16 5.16 0 01-.13-.31 9.3 9.3 0 00-.7-1.44l-1.23.78z"
                                    fill="#FFF"
                                  />
                                  <path
                                    d="M17.33 5.07c-1.92 0-3.66.46-4.95.88-.7.23-1.3.44-1.78.54-1.05.23-2.37.26-3.44.23l-.13-.01v3.07l.14.01a11 11 0 004.27-.65c.45-.14 1.03-.29 1.86-.45 1.5-.31 3.6-.61 6.03-.1.82.17 1.63.5 2.42.82.41.17.8.33 1.18.47l.16.06 1.03-2.89-.1-.05c-.08-.04-.2-.1-.33-.17-.6-.26-1.53-.71-2.65-1.1-1.24-.43-2.36-.66-3.71-.66z"
                                    fill="#FFF"
                                  />
                                </g>
                              </svg>
                            )}
                            {network === "usdt" && (
                              <svg viewBox="0 0 32 32" width="24" height="24">
                                <g fill="none" fillRule="evenodd">
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="16"
                                    fill="#26A17B"
                                  />
                                  <path
                                    fill="#FFF"
                                    d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"
                                  />
                                </g>
                              </svg>
                            )}
                            {network === "bitcoin" && (
                              <svg viewBox="0 0 32 32" width="24" height="24">
                                <g fill="none" fillRule="evenodd">
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="16"
                                    fill="#F7931A"
                                  />
                                  <path
                                    fill="#FFF"
                                    fillRule="nonzero"
                                    d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.53-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.356l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
                                  />
                                </g>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {
                                networkNames[
                                  network as keyof typeof networkNames
                                ]
                              }
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Network fee: ~$2-5
                            </p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="mt-4 text-sm text-[#5B46F6] hover:underline"
                    >
                      ← Back to amount
                    </button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="flex flex-col space-y-6">
                    <h2 className="text-lg font-semibold">Make Your Payment</h2>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm mb-4">
                        Please send{" "}
                        <span className="font-bold">${depositAmount}</span>{" "}
                        worth of{" "}
                        {
                          networkNames[
                            selectedNetwork as keyof typeof networkNames
                          ]
                        }{" "}
                        to the address below:
                      </p>

                      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        <div className="md:w-1/3 p-2 bg-white rounded-md">
                          <QRCode
                            value={
                              cryptoAddresses[
                                selectedNetwork as keyof typeof cryptoAddresses
                              ]
                            }
                            size={150}
                            level="H"
                            className="mx-auto"
                          />
                        </div>
                        <div className="md:w-2/3 break-all">
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {
                                cryptoAddresses[
                                  selectedNetwork as keyof typeof cryptoAddresses
                                ]
                              }{" "}
                              Address
                            </label>
                            <div className="flex items-center">
                              <div className="bg-white dark:bg-gray-800 text-sm p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg flex-1 break-all">
                                {
                                  cryptoAddresses[
                                    selectedNetwork as keyof typeof cryptoAddresses
                                  ]
                                }
                              </div>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    cryptoAddresses[
                                      selectedNetwork as keyof typeof cryptoAddresses
                                    ]
                                  )
                                }
                                className="bg-[#5B46F6] text-white p-3 rounded-r-lg"
                                title="Copy to clipboard"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 text-sm">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400 dark:text-yellow-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                              Important:
                            </p>
                            <ul className="mt-1 list-disc list-inside text-yellow-700 dark:text-yellow-300">
                              <li>
                                Send only {selectedNetwork.toUpperCase()} to
                                this address
                              </li>
                              <li>
                                Transaction may take 10-30 minutes to be
                                confirmed
                              </li>
                              <li>Minimum deposit amount is $50</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePaymentConfirmation}
                        className="flex-1 px-4 py-2 bg-[#5B46F6] text-white font-medium rounded-lg hover:bg-[#5B46F6]/90 transition-colors"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "I've Completed the Payment"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Deposit Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Deposit Information
                </h2>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Deposits are typically credited within 30 minutes after
                    network confirmation.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    The exchange rate will be calculated at the time of deposit
                    confirmation.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Double check the network type before sending funds to avoid
                    loss.
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-[#5B46F6] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    For help with your deposit, please contact support.
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Pending Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center text-center">
              {/* Pending Icon */}
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Deposit Pending</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your deposit of ${depositAmount} worth of{" "}
                {networkNames[selectedNetwork as keyof typeof networkNames]} has
                been submitted and is pending confirmation.
              </p>
              {transactionId && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Transaction ID:{" "}
                  <span className="font-mono">{transactionId}</span>
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Please allow some time for the blockchain to confirm your
                transaction. Your funds will be credited to your account
                shortly.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={resetProcess}
                  className="flex-1 py-2 px-4 border border-[#5B46F6] text-[#5B46F6] font-medium rounded-lg hover:bg-[#5B46F6]/10 transition-all duration-200"
                >
                  New Deposit
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 bg-[#5B46F6] text-white font-medium rounded-lg hover:bg-[#5B46F6]/90 transition-all duration-200"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}
