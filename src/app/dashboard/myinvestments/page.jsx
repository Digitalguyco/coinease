"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Investments() {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState("");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch user investments using the correct endpoint
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.get('http://localhost:9000/api/transactions/investments/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setInvestments(response.data);
        setFilteredInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error);
        setError("Failed to load investments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Filter investments based on status
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredInvestments(investments);
    } else {
      const filtered = investments.filter(investment => investment.status.toLowerCase() === activeFilter);
      setFilteredInvestments(filtered);
    }
  }, [activeFilter, investments]);

  // Calculate progress for an investment
  const calculateProgress = (investment) => {
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge class
  const getStatusBadgeClass = (status) => {
    console.log(status);
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
            <div className="container mx-auto max-w-6xl">
              <h1 className="text-2xl font-bold mb-6">My Investments</h1>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}
              
              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeFilter === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    All Investments
                  </button>
                  <button
                    onClick={() => setActiveFilter("ongoing")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeFilter === "ongoing"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Ongoing
                  </button>
                  <button
                    onClick={() => setActiveFilter("halfway")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeFilter === "halfway"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Halfway
                  </button>
                  <button
                    onClick={() => setActiveFilter("completed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeFilter === "completed"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setActiveFilter("cancelled")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      activeFilter === "cancelled"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              
              {/* Investments List */}
              {filteredInvestments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInvestments.map(investment => {
                    const progress = calculateProgress(investment);
                    
                    return (
                      <Link 
                        href={`/dashboard/myinvestments/${investment.id}`} 
                        key={investment.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">
                              {investment.plan.tier} {investment.plan.level} Plan
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {investment.amount} {investment.currency}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(investment.status)}`}>
                            {investment.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Daily ROI:</span>
                            <span className="font-medium">{investment.plan.daily_roi}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Total Returns:</span>
                            <span className="font-medium">{investment.total_returns || 0} {investment.currency}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                            <span className="font-medium">{formatDate(investment.end_date)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No investments found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {activeFilter === "all" 
                      ? "You don't have any investments yet." 
                      : `You don't have any ${activeFilter} investments.`}
                  </p>
                  <Link 
                    href="/dashboard/invest" 
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Your First Investment
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
} 