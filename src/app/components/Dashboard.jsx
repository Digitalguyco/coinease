"use client";
import React, { useState, useEffect, Suspense } from "react";
import Drawer from "./Dashboard/Drawer";
import Header from "./Dashboard/Header";
import LoadingSpinner from "./Dashboard/LoadingSpinner";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { API_URL } from "../constants";
// Use React.lazy to dynamically import the TradingViewWidget
const TradingViewWidget = React.lazy(() => import("./Dashboard/TradingView"));

export default function Dashboard() {
  const { user, isAuthenticated, updateUserBalance } = useAuth();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activePeriod, setActivePeriod] = useState("1M");
  
  // State for live data
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [dailyChange, setDailyChange] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [isBalanceUpdating, setIsBalanceUpdating] = useState(false);
  
  const [cryptoData, setCryptoData] = useState({
    BTC: { price: 0, change: 0, holdings: 0.85, sparkline: [] },
    ETH: { price: 0, change: 0, holdings: 23.5, sparkline: [] },
    LTC: { price: 0, change: 0, holdings: 135.7, sparkline: [] },
  });
  const [marketTrends, setMarketTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Set up polling for balance updates
  useEffect(() => {
    if (user && user.id) {
        // console.log(user);
      // Initial balance setup from user data
      if (portfolioValue === 0 && user.balance) {
        const userBalance = parseFloat(user.balance);
        const previousValue = userBalance - (userBalance * 0.012); // 1.2% less for demonstration
        setPreviousBalance(previousValue);
        setDailyChange(userBalance - previousValue);
        setPercentChange(((userBalance / previousValue) - 1) * 100);
        setPortfolioValue(userBalance);
      }
      
      // Function to fetch balance updates
      const fetchBalanceUpdate = async () => {
        try {
          setIsBalanceUpdating(true);
          const token = localStorage.getItem('accessToken');
          
          const response = await axios.get(`${API_URL}/balance/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            
            }
          });
          
          if (response.data && response.data.balance !== undefined) {
            console.log(response.data.balance);
            const newBalance = parseFloat(response.data.balance);
            
            // Only update if balance has changed
            if (newBalance !== portfolioValue) {
              // Store the previous value before updating
              const oldBalance = portfolioValue;
              setPreviousBalance(oldBalance);
              
              // Calculate daily change and percentage
              const balanceChange = newBalance - oldBalance;
              setDailyChange(balanceChange);
              
              if (oldBalance > 0) {
                const percentageChange = ((newBalance / oldBalance) - 1) * 100;
                setPercentChange(percentageChange);
              }
              
              // Update portfolio value with new balance
              setPortfolioValue(newBalance);

            //   update user balance in context
            updateUserBalance(newBalance);
              
            //   console.log(`Balance updated to: ${newBalance}`);
            }
          }
          setIsBalanceUpdating(false);
        } catch (error) {
          console.error('Error fetching balance update:', error);
          setIsBalanceUpdating(false);
        }
      };
      
      // Fetch balance immediately
      fetchBalanceUpdate();
      
      // Then set up interval to check for updates
      const intervalId = setInterval(fetchBalanceUpdate, 10000); // Poll every 10 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Fetch crypto price data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,litecoin&order=market_cap_desc&sparkline=true'
        );
        
        if (!response.ok) throw new Error('Failed to fetch crypto data');
        
        const data = await response.json();
        
        const newCryptoData = { ...cryptoData };
        let totalValue = 0;
        
        data.forEach(coin => {
          const symbol = coin.symbol.toUpperCase();
          if (cryptoData[symbol]) {
            newCryptoData[symbol] = {
              price: coin.current_price,
              change: coin.price_change_percentage_24h,
              holdings: cryptoData[symbol].holdings,
              sparkline: coin.sparkline_in_7d?.price || []
            };
            
            // Calculate contribution to portfolio value
            totalValue += coin.current_price * cryptoData[symbol].holdings;
          }
        });
        
        // Update crypto data
        setCryptoData(newCryptoData);
        
        // If we have user data, use their balance instead of the crypto calculation
        if (!user || !user.balance) {
          setPortfolioValue(Math.round(totalValue));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setIsLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [ user]);

  // Fetch market trends
  useEffect(() => {
    const fetchMarketTrends = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5'
        );
        
        if (!response.ok) throw new Error('Failed to fetch market data');
        
        const data = await response.json();
        
        const formattedData = data.map(coin => ({
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          priceFormatted: `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: coin.price_change_percentage_24h,
          changeFormatted: `${coin.price_change_percentage_24h.toFixed(1)}%`,
          cap: `$${(coin.market_cap / 1e9).toFixed(1)}B`,
          trending: coin.price_change_percentage_24h >= 0 ? "up" : "down",
          image: coin.image
        }));
        
        setMarketTrends(formattedData);
      } catch (error) {
        console.error("Error fetching market trends:", error);
      }
    };

    fetchMarketTrends();
    const interval = setInterval(fetchMarketTrends, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.livecoinwatch.com/static/lcw-widget.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
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
        console.log(response.data);
        setInvestmentPlans(response.data);
      } catch (error) {
        console.error("Error fetching investment plans:", error);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchInvestmentPlans();
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Drawer Navigation */}
        <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <Header isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

          <main className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900">
            {/* Welcome message with user name */}
            {isAuthenticated && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Welcome back, {user?.full_name.split(' ')[0] || 'User'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Here's what's happening with your portfolio today
                </p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative">
               
                
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio Value</div>
                  {isLoading ? (
                    <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  ) : (
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      percentChange >= 0 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}>
                      {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(1)}%
                    </div>
                  )}
                </div>
                {isLoading ? (
                  <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={`ml-2 text-sm ${
                      dailyChange >= 0 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {dailyChange >= 0 ? "+" : ""}{dailyChange.toFixed(2)} today
                    </span>
                  </div>
                )}
                <Link href="/dashboard/deposit" className="mt-3 block w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 text-center">
                  Add Funds
                </Link>
              </div>

              {/* Dynamic crypto cards with real-time data */}
              {['BTC', 'ETH', 'LTC'].map((symbol, index) => {
                const coin = {
                  BTC: { name: 'Bitcoin' },
                  ETH: { name: 'Ethereum' },
                  LTC: { name: 'Litecoin' }
                }[symbol];
                
                const data = cryptoData[symbol];
                const isPositive = data.change >= 0;
                
                return (
                  <div 
                    key={symbol} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{coin.name}</div>
                      {isLoading ? (
                        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      ) : (
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          isPositive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        }`}>
                          {isPositive ? "+" : ""}{data.change.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    {isLoading ? (
                      <>
                        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{data.holdings} {symbol}</span>
                        </div>
                        <div className="mt-3 h-10">
                          {data.sparkline.length > 0 ? (
                            <Sparklines data={data.sparkline.slice(-100)} height={15} width={100}>
                              <SparklinesLine color={theme === "dark" ? "#818cf8" : "#4f46e5"} />
                            </Sparklines>
                          ) : (
                            <div className="h-10 flex items-center justify-center text-sm text-gray-400">
                              No chart data available
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Portfolio Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Charts Section */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Market Chart</h3>
                  <div className="flex space-x-2">
                    {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
                      <button
                        key={period}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          period === activePeriod 
                            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setActivePeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[400px]">
                  <Suspense fallback={<LoadingSpinner />}>
                    <TradingViewWidget />
                  </Suspense>
                </div>
              </div>

              {/* Portfolio & Plans */}
              <div className="space-y-6">
                {/* Portfolio Distribution Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-bold text-lg mb-4">Portfolio Distribution</h3>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Calculate portfolio distribution based on real prices */}
                      {(() => {
                        const totalValue = portfolioValue;
                        const btcValue = cryptoData.BTC.price * cryptoData.BTC.holdings;
                        const ethValue = cryptoData.ETH.price * cryptoData.ETH.holdings;
                        const ltcValue = cryptoData.LTC.price * cryptoData.LTC.holdings;
                        const otherValue = totalValue - btcValue - ethValue - ltcValue;
                        
                        const btcPercent = Math.round((btcValue / totalValue) * 100) || 0;
                        const ethPercent = Math.round((ethValue / totalValue) * 100) || 0;
                        const ltcPercent = Math.round((ltcValue / totalValue) * 100) || 0;
                        const otherPercent = Math.max(0, 100 - btcPercent - ethPercent - ltcPercent);
                        
                        return (
                          <>
                            <div className="flex items-center mb-3">
                              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                              <div className="flex-1 flex justify-between">
                                <span className="text-sm">Bitcoin (BTC)</span>
                                <span className="text-sm font-medium">{btcPercent}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${btcPercent}%` }}></div>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                              <div className="flex-1 flex justify-between">
                                <span className="text-sm">Ethereum (ETH)</span>
                                <span className="text-sm font-medium">{ethPercent}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${ethPercent}%` }}></div>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              <div className="flex-1 flex justify-between">
                                <span className="text-sm">Litecoin (LTC)</span>
                                <span className="text-sm font-medium">{ltcPercent}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${ltcPercent}%` }}></div>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              <div className="flex-1 flex justify-between">
                                <span className="text-sm">Cash Balance</span>
                                <span className="text-sm font-medium">{otherPercent}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${otherPercent}%` }}></div>
                            </div>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>

                {/* Investment Plans */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Top Plans</h3>
                    <Link href={'/dashboard/invest'} className="text-xs font-medium px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {plansLoading ? (
                      Array(3).fill(0).map((_, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse"
                        >
                          <div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                      ))
                    ) : investmentPlans.length > 0 ? (
                      investmentPlans.slice(0, 3).map((plan) => (
                        <div 
                          key={plan.id} 
                          className="flex justify-between items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors duration-200"
                        >
                          <div>
                            <div className="text-sm font-medium">{plan.tier.toUpperCase()} {plan.level.toUpperCase()} Plan</div>
                            <div className="flex items-center space-x-2">
                              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{plan.daily_roi}% daily</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Min: ${plan.min_deposit}</span>
                            </div>
                          </div>
                          <Link href={`/dashboard/invest?plan=${plan.id}`} className="text-xs font-medium px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
                            Invest
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No investment plans available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Trends - Live Data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Market Trends</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {marketTrends.length > 0 ? "Live Data" : "Loading..."}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${marketTrends.length > 0 ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">24h Change</th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</th>
                      <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {marketTrends.length > 0 ? (
                      marketTrends.map((coin, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex-shrink-0 mr-3 rounded-full overflow-hidden">
                                {coin.image ? (
                                  <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    {coin.symbol.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{coin.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium">{coin.priceFormatted}</td>
                          <td className={`px-4 py-3 whitespace-nowrap font-medium ${
                            coin.trending === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}>
                            {coin.changeFormatted}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{coin.cap}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded">Buy</button>
                              <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">Trade</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Loading state for market trends
                      Array(5).fill(0).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                              <div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
