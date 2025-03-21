"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";
import axios from "axios";

// Transaction type definition updated to match API response
interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  deposit_details?: unknown; // Additional details for deposits
}

export default function Transactions() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.get('https://coinease.live/api/transactions/transactions/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setIsError(true);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(error.response.data.error || "Failed to load transactions");
        } else {
          setErrorMessage("Network error. Please try again later.");
        }
      } finally {
        // Add a small delay to prevent flashing of loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    fetchTransactions();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...transactions];
    
    if (typeFilter !== "all") {
      result = result.filter(tx => tx.type === typeFilter);
    }
    
    if (statusFilter !== "all") {
      result = result.filter(tx => tx.status === statusFilter);
    }
    
    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [typeFilter, statusFilter, transactions]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Status badge style helper
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
      case 'failure':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Type badge style helper
  const getTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'withdrawal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'investment':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get available transaction types for filter
  const getAvailableTypes = () => {
    const types = new Set(transactions.map(tx => tx.type));
    return Array.from(types);
  };

  // Get available transaction statuses for filter
  const getAvailableStatuses = () => {
    const statuses = new Set(transactions.map(tx => tx.status));
    return Array.from(statuses);
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
              <h1 className="text-2xl font-bold mb-6">Transactions</h1>
              
              {/* Error Message */}
              {isError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                  <p className="font-bold">Error</p>
                  <p>{errorMessage}</p>
                </div>
              )}
              
              {/* No Transactions Message */}
              {!isLoading && !isError && transactions.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No Transactions Found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You don&apos;t have any transactions yet. Make a deposit or investment to get started.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="/dashboard/deposit" 
                      className="px-4 py-2 bg-[#5B46F6] text-white rounded-lg hover:bg-[#4938C4] transition-colors"
                    >
                      Make a Deposit
                    </a>
                    <a 
                      href="/dashboard/invest" 
                      className="px-4 py-2 border border-[#5B46F6] text-[#5B46F6] rounded-lg hover:bg-[#5B46F6]/10 transition-colors"
                    >
                      Invest Now
                    </a>
                  </div>
                </div>
              )}
              
              {!isLoading && !isError && transactions.length > 0 && (
                <>
                  {/* Filters */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Transaction Type
                        </label>
                        <select
                          id="typeFilter"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          <option value="all">All Types</option>
                          {getAvailableTypes().map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          id="statusFilter"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          {getAvailableStatuses().map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {currentItems.length} of {filteredTransactions.length} transactions
                    </div>
                  </div>
                  
                  {/* Transactions Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {currentItems.length > 0 ? (
                            currentItems.map((transaction) => (
                              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {formatDate(transaction.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeClass(transaction.type)}`}>
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {transaction.amount} {transaction.currency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {transaction.description}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No transactions found matching your filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Pagination */}
                  {filteredTransactions.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-md">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Show
                        </span>
                        <select
                          className="mx-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>
                              {number}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          per page
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          Previous
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`w-8 h-8 rounded-md ${
                                currentPage === number
                                  ? 'bg-[#5B46F6] text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {number}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages || totalPages === 0}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages || totalPages === 0
                              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
