"use client";
import React, { useState, useEffect } from 'react';
import Drawer from '../../components/Dashboard/Drawer';
import Header from '../../components/Dashboard/Header';
import LoadingSpinner from '../../components/Dashboard/LoadingSpinner';
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user, isLoading: authLoading, updateUserProfile } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // User profile data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    referralCode: '',
    phone: '',
    address: '',
    occupation: '',
    annualIncome: '',
    avatar: '/default.png',
  });

  // Form data for editing
  const [formData, setFormData] = useState({...profile});
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
  
        
        const userData = user;
        console.log(userData);
        const profileData = {
          fullName: userData.full_name || '',
          email: userData.email || '',
          referralCode: userData.referral_code || 'REF' + Math.floor(10000 + Math.random() * 90000),
          phone: userData.phone || '',
          address: userData.address || '',
          occupation: userData.occupation || '',
          annualIncome: userData.annual_income || '',
          avatar: userData.avatar || '/default.png',
        };
        
        setProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorMessage("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else {
      // Set some defaults if no user is available yet
      setProfile({
        fullName: 'User',
        email: '',
        referralCode: 'REF' + Math.floor(10000 + Math.random() * 90000),
        phone: '',
        address: '',
        occupation: '',
        annualIncome: '',
        avatar: '/default.png',
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes if canceling edit mode
      setFormData({...profile});
    }
    setIsEditing(!isEditing);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      
      // Convert formData to the format expected by the API
      const apiData = {
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        occupation: formData.occupation,
        annual_income: parseFloat(formData.annualIncome) || 0,
        // Don't send email if it hasn't changed to avoid unnecessary validation
        ...(formData.email !== profile.email && { email: formData.email }),
      };

      const response = await axios.put(
        'http://localhost:9000/api/accounts/update-profile/',
        apiData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local profile state
      setProfile({...formData});
      
      // Create updated user object for the context
      const updatedUser = {
        ...user,
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
        address: formData.address,
        occupation: formData.occupation,
        annual_income: formData.annualIncome
      };
      
      // Update user in AuthContext
      if (updateUserProfile && typeof updateUserProfile === 'function') {
        await updateUserProfile(updatedUser);
      }
      
      // Manually update localStorage to ensure persistence after refresh
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const updatedUserData = {
          ...parsedUserData,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          address: formData.address,
          occupation: formData.occupation,
          annual_income: formData.annualIncome
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific API error messages
        if (error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else if (error.response.data.detail) {
          setErrorMessage(error.response.data.detail);
        } else {
          setErrorMessage("Failed to update profile. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Drawer Navigation */}
      <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your personal information and account preferences
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 rounded-lg flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 rounded-lg flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v4a1 1 0 11-2 0V9zm0-4a1 1 0 112 0 1 1 0 01-2 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                {errorMessage}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header with Avatar */}
              <div className="p-6 sm:p-8 bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800">
                      <img 
                        src={isEditing ? formData.avatar : profile.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                         
                       
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                      <div className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-3 py-1 rounded-full">
                        Member since {new Date(user?.date_joined || Date.now()).getFullYear() || '2023'}
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow"></div>

                  <button
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isEditing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                    }`}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                      Personal Information
                    </h3>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {profile.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {profile.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {profile.phone || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Referral Code (non-editable) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Referral Code</label>
                    <div className="flex items-center">
                      <div className="flex-grow px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {profile.referralCode}
                      </div>
                      <button
                        type="button"
                        className="ml-2 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                        onClick={() => {
                          navigator.clipboard.writeText(profile.referralCode);
                          setSuccessMessage('Referral code copied to clipboard!');
                          setTimeout(() => setSuccessMessage(''), 3000);
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      ></textarea>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {profile.address || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Additional Information Section */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                      Additional Information
                    </h3>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Occupation</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {profile.occupation || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Annual Income</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                       $ {profile.annualIncome || 'N/A'}
                      </div>
                    )}
                  </div>

                  {/* Submit Button (only shown in edit mode) */}
                  {isEditing && (
                    <div className="md:col-span-2 mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
