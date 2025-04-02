"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "@/app/components/Dashboard";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface SignalPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  strength_level: number;
  trades_count: number;
}

export default function SignalPlansPage() {
  const [plans, setPlans] = useState<SignalPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [currentSignal, setCurrentSignal] = useState({
    strength: 0,
    signal_trades_remaining: 0,
  });
  const router = useRouter();

  useEffect(() => {
    // Fetch available signal plans
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("https://coinease.live/api/accounts/signal/plans/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch signal plans");
        }


        const data = await response.json();
        console.log(data);
        setPlans(data);
      } catch (error) {
        console.error("Error fetching signal plans:", error);
        toast.error("Failed to load signal plans");
      } finally {
        setLoading(false);
      }
    };

    // Fetch user's current signal strength
    const fetchSignalStrength = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("https://coinease.live/api/accounts/signal/strength/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch signal strength");
        }

        const data = await response.json();
        setCurrentSignal({
          strength: data.signal_strength || 0,
          signal_trades_remaining: data.signal_trades_remaining || 0,
        });
      } catch (error) {
        console.error("Error fetching signal strength:", error);
      }
    };

    // Fetch user balance
    const fetchUserBalance = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("https://coinease.live/api/accounts/balance/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user balance");
        }

        const data = await response.json();
        setUserBalance(data.balance || 0);
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };

    fetchPlans();
    fetchSignalStrength();
    fetchUserBalance();
  }, []);

  const handlePurchase = async (planId: number) => {
    setPurchasing(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("https://coinease.live/api/accounts/signal/purchase/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase plan");
      }

      // Success response, no need to use the data directly
      await response.json();
      toast.success("Signal plan purchased successfully!");
      
      // Refresh signal strength and balance
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error purchasing signal plan:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to purchase plan";
      toast.error(errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const getSignalColor = (strength: number): string => {
    if (strength >= 75) return "bg-green-500";
    if (strength >= 50) return "bg-lime-500";
    if (strength >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper function to convert strength level to percentage
  const strengthToPercentage = (level: number): number => {
    // Assuming levels 1-4 where 4 is 100%
    return (level / 4) * 100;
  };



  return (
    <Dashboard>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Signal Plans</h1>

        {/* Current signal status */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Signal Status</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Strength
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getSignalColor(strengthToPercentage(currentSignal.strength))}`}
                    style={{ width: `${strengthToPercentage(currentSignal.strength)}%` }}
                  ></div>
                </div>
                <span className="font-medium">{strengthToPercentage(currentSignal.strength)}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Trades Remaining
              </div>
              <div className="font-medium">
                {currentSignal.signal_trades_remaining} trades remaining
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-auto">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Your Balance
              </div>
              <div className="font-bold text-lg">${userBalance}</div>
            </div>
          </div>
        </div>

        {/* Signal Plans */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02]"
              >
                <div
                  className={`${getSignalColor(strengthToPercentage(plan.strength_level))} h-2 w-full`}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      / {plan.trades_count} trades
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Signal Strength:
                      </span>
                      <span className="ml-auto font-bold">{strengthToPercentage(plan.strength_level)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getSignalColor(strengthToPercentage(plan.strength_level))}`}
                        style={{ width: `${strengthToPercentage(plan.strength_level)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-500 mt-1 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Access to {plan.trades_count} trades
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-500 mt-1 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Level {plan.strength_level} signal strength
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-500 mt-1 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Real-time market updates
                        </span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={purchasing || userBalance < plan.price}
                    className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                      userBalance < plan.price
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {purchasing ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </span>
                    ) : userBalance < plan.price ? (
                      "Insufficient Balance"
                    ) : (
                      "Purchase Plan"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {plans.length === 0 && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
            <p className="text-yellow-700 dark:text-yellow-400">
              No signal plans are currently available. Please check back later.
            </p>
          </div>
        )}

        {/* Additional information */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">About Signal Plans</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Signal plans enhance your trading experience by providing real-time market signals and investment opportunities. Higher strength plans offer more accurate signals and premium features.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              * Signal plans are non-refundable once purchased
            </p>
            <p>
              * You can upgrade your plan at any time
            </p>
          </div>
        </div>

        {/* Add Toaster for notifications */}
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          }
        }} />
      </div>
    </Dashboard>
  );
} 