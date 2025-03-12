"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "../../components/Dashboard/Drawer";
import Header from "../../components/Dashboard/Header";
import LoadingSpinner from "../../components/Dashboard/LoadingSpinner";

// Transaction type definition
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment';
  status: 'successful' | 'failed' | 'pending';
  amount: number;
  currency: string;
  date: string;
  description: string;
}

// Dummy transaction data
const dummyTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "deposit",
    status: "successful",
    amount: 2.5,
    currency: "BTC",
    date: "2023-11-01T14:30:00",
    description: "Deposit from external wallet"
  },
  {
    id: "tx2",
    type: "withdrawal",
    status: "failed",
    amount: 1.2,
    currency: "ETH",
    date: "2023-11-02T09:15:00",
    description: "Withdrawal attempt to wallet ending in 8f4d"
  },
  {
    id: "tx3",
    type: "investment",
    status: "successful",
    amount: 500,
    currency: "USDT",
    date: "2023-11-03T16:45:00",
    description: "Added funds to Silver investment plan"
  },
  {
    id: "tx4",
    type: "deposit",
    status: "pending",
    amount: 0.75,
    currency: "BTC",
    date: "2023-11-04T11:20:00",
    description: "Deposit from Binance exchange"
  },
  {
    id: "tx5",
    type: "withdrawal",
    status: "successful",
    amount: 1000,
    currency: "USDT",
    date: "2023-11-05T13:10:00",
    description: "Withdrawal to bank account"
  },
  {
    id: "tx6",
    type: "investment",
    status: "successful",
    amount: 2000,
    currency: "USDT",
    date: "2023-11-06T10:05:00",
    description: "Added funds to Gold investment plan"
  },
  {
    id: "tx7",
    type: "deposit",
    status: "failed",
    amount: 1.5,
    currency: "ETH",
    date: "2023-11-07T15:30:00",
    description: "Deposit attempt from MetaMask wallet"
  },
  {
    id: "tx8",
    type: "withdrawal",
    status: "pending",
    amount: 0.5,
    currency: "BTC",
    date: "2023-11-08T09:45:00",
    description: "Withdrawal to Coinbase"
  },
  {
    id: "tx9",
    type: "investment",
    status: "failed",
    amount: 5000,
    currency: "USDT",
    date: "2023-11-09T14:20:00",
    description: "Failed attempt to add funds to Platinum plan"
  },
  {
    id: "tx10",
    type: "deposit",
    status: "successful",
    amount: 3.2,
    currency: "ETH",
    date: "2023-11-10T11:15:00",
    description: "Deposit from Kraken exchange"
  },
  {
    id: "tx11",
    type: "withdrawal",
    status: "successful",
    amount: 0.3,
    currency: "BTC",
    date: "2023-11-11T16:30:00",
    description: "Withdrawal to hardware wallet"
  },
  {
    id: "tx12",
    type: "investment",
    status: "pending",
    amount: 1500,
    currency: "USDT",
    date: "2023-11-12T10:40:00",
    description: "Processing addition to Silver plan"
  },
  {
    id: "tx13",
    type: "deposit",
    status: "successful",
    amount: 0.8,
    currency: "BTC",
    date: "2023-11-13T13:25:00",
    description: "Deposit from external wallet"
  },
  {
    id: "tx14",
    type: "withdrawal",
    status: "failed",
    amount: 2.1,
    currency: "ETH",
    date: "2023-11-14T14:50:00",
    description: "Insufficient funds for withdrawal"
  },
  {
    id: "tx15",
    type: "investment",
    status: "successful",
    amount: 3000,
    currency: "USDT",
    date: "2023-11-15T09:30:00",
    description: "Added funds to Platinum investment plan"
  },
];

export default function Transactions() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Initialize data
  useEffect(() => {
    setTransactions(dummyTransactions);
    setFilteredTransactions(dummyTransactions);
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

  // Introduce a delay for the loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Delay in milliseconds

    return () => clearTimeout(timer);
  }, []);

  // Status badge style helper
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Type badge style helper
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
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
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="investment">Investment</option>
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
                      <option value="successful">Successful</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
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
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
