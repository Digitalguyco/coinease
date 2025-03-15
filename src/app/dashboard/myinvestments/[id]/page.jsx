"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Drawer from "../../../components/Dashboard/Drawer";
import Header from "../../../components/Dashboard/Header";
import LoadingSpinner from "../../../components/Dashboard/LoadingSpinner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function InvestmentDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [investment, setInvestment] = useState(null);
  const [error, setError] = useState("");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch investment details using the correct endpoint
  useEffect(() => {
    const fetchInvestmentDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.get(`https://coinease.live/api/transactions/investments/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setInvestment(response.data);
      } catch (error) {
        console.error("Error fetching investment details:", error);
        setError("Failed to load investment details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchInvestmentDetail();
    }
  }, [id]);

  // Calculate progress for an investment
  const calculateProgress = (investment) => {
    if (!investment) return 0;
    
    const startDate = new Date(investment.start_date);
    const endDate = new Date(investment.end_date);
    const currentDate = new Date();
    
    if (currentDate > endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)).toFixed(2);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge class
  const getStatusBadgeClass = (status) => {
    if (!status) return "";
    
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'halfway':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
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
              <div className="flex items-center mb-6">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold">Investment Details</h1>
              </div>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}
              
              {investment && (
                <>
                  {/* Investment Header Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{investment.plan.tier} {investment.plan.level} Plan</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {user?.email}
                        </p>
                      </div>
                      <span className={`mt-2 md:mt-0 px-4 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(investment.status)}`}>
                        {investment.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Progress</span>
                        <span className="text-gray-500 dark:text-gray-400">{calculateProgress(investment)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${calculateProgress(investment)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="font-semibold">{investment.amount} {investment.currency}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Daily ROI</p>
                        <p className="font-semibold">{investment.plan.daily_roi}%</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Returns</p>
                        <p className="font-semibold">{investment.total_returns || 0} {investment.currency}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-semibold">{investment.plan.duration} days</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Investment Details Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Investment Details</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                          <p className="font-medium">{investment.plan.tier} {investment.plan.level} Plan</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="font-medium">{investment.amount}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                          <p className="font-medium">{investment.currency}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <p className="font-medium">{investment.status}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">End date</p>
                          <p className="font-medium">{formatDate(investment.end_date)}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Note: You are 1 hour ahead of server time.</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total returns</p>
                          <p className="font-medium">{investment.total_returns || 0}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last payout date</p>
                          <p className="font-medium">{formatDate(investment.last_payout_date) || "N/A"}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Note: You are 1 hour ahead of server time.</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Next payout date</p>
                          <p className="font-medium">{formatDate(investment.next_payout_date) || "N/A"}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Note: You are 1 hour ahead of server time.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Transaction</p>
                          <p className="font-medium">{investment.transaction?.description || `Investment of ${investment.amount} ${investment.currency} - ${investment.transaction?.status || 'Successful'}`}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Start date</p>
                          <p className="font-medium">{formatDate(investment.start_date)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div
                                className="bg-indigo-600 h-2.5 rounded-full"
                                style={{ width: `${calculateProgress(investment)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium">{calculateProgress(investment)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center mb-6">
                    <Link
                      href="/dashboard/myinvestments"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Back to Investments
                    </Link>
                    
                    <Link
                      href="/dashboard/invest"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create New Investment
                    </Link>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
} 