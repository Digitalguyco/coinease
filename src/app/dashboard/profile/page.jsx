"use client";
import React, { useState, useEffect } from 'react';
import Drawer from '../../components/Dashboard/Drawer';
import Header from '../../components/Dashboard/Header';
import LoadingSpinner from '../../components/Dashboard/LoadingSpinner';

export default function Profile() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // User profile data
  const [profile, setProfile] = useState({
    fullName: 'James Doe',
    email: 'james@gmail.com',
    referralCode: 'REF72891',
    phone: '+1 (555) 123-4567',
    address: '123 Crypto Street, Blockchain City, BC 12345',
    occupation: 'Software Developer',
    annualIncome: '$120,000',
    avatar: '/default.png',
  });

  // Form data for editing
  const [formData, setFormData] = useState({...profile});
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes if canceling edit mode
      setFormData({...profile});
    }
    setIsEditing(!isEditing);
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setProfile({...formData});
      setIsEditing(false);
      setIsLoading(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
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
                
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                      <div className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 px-3 py-1 rounded-full">
                        Member since 2023
                      </div>
                      {/* <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full">
                        Verified
                      </div> */}
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
                        {profile.phone}
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
                        {profile.address}
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
                        {profile.occupation}
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
                        {profile.annualIncome}
                      </div>
                    )}
                  </div>

                  {/* Submit Button (only shown in edit mode) */}
                  {isEditing && (
                    <div className="md:col-span-2 mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center"
                      >
                        {isLoading ? (
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
