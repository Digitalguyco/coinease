"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';  // First install this: npm install js-cookie @types/js-cookie

// API URL - make sure this is correct
import { API_URL } from '@/app/constants';

// Types
type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  balance: string;
  wallet_address: string | null;
  phone_number: string | null;
  referral_code: string;
  address: string | null;
  occupation: string | null;
  annual_income: string | null;
  is_staff: boolean;
  date_joined: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get token from cookies first (for server-side), then localStorage (for client-side)
        const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
        
        // If no token, user is not authenticated
        if (!token) {
          setIsLoading(false);
          setIsAuthenticated(false);
          return;
        }
        
        // If token exists, set it in both storage locations to keep them in sync
        if (token) {
          Cookies.set('accessToken', token, { expires: 1 }); // 1 day expiry
          localStorage.setItem('accessToken', token);
        }
        
        // Add token to axios headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data from localStorage to avoid extra API call
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        // If there's an error, clear tokens and user data
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/login/`, { email, password });
      
      // Save tokens and user data
      const { access, refresh, user } = response.data;
      
      // Store in both localStorage and cookies for cross-compatibility
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userData', JSON.stringify(user));
      
      // Set cookies with 1 day expiry
      Cookies.set('accessToken', access, { expires: 1 }); // 1 day
      Cookies.set('refreshToken', refresh, { expires: 7 }); // 7 days for refresh token
      
      // Set auth header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      setIsLoading(false);
      let errorMessage = 'Login failed. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens and user data from both storage mechanisms
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 