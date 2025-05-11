'use client';

import { useState } from 'react';
import { Banner } from 'src/components/Banner';
import Navbar from 'src/components/Navbar';
import Link from 'next/link';
import { User, Package, CreditCard, LogOut, ChevronRight } from 'lucide-react';

// Mock user data - would come from your auth system
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: null,
  joinDate: 'January 2023',
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="flex min-h-screen flex-col font-sansMono">
      <Banner />
      <Navbar />
      
      <main className="container mx-auto flex-grow px-4 pt-24">
        <h1 className="mb-8 text-3xl font-bold">My Account</h1>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    {userData.avatarUrl ? (
                      <img 
                        src={userData.avatarUrl} 
                        alt={userData.name} 
                        className="h-full w-full rounded-full object-cover" 
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="divide-y divide-gray-200">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 ${
                    activeTab === 'profile' ? 'bg-gray-50 font-medium' : ''
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-3 text-gray-500" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                
                <Link
                  href="/account/orders"
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Package size={18} className="mr-3 text-gray-500" />
                    <span>Order History</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                
                <button
                  type="button"
                  className={`flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 ${
                    activeTab === 'payment' ? 'bg-gray-50 font-medium' : ''
                  }`}
                  onClick={() => setActiveTab('payment')}
                >
                  <div className="flex items-center">
                    <CreditCard size={18} className="mr-3 text-gray-500" />
                    <span>Payment Methods</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                
                <button
                  type="button"
                  className="flex w-full items-center p-4 text-left text-red-500 hover:bg-gray-50"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="rounded-lg border border-gray-200 p-6">
                <h2 className="mb-6 text-xl font-medium">Profile Information</h2>
                
                <form>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        defaultValue="John"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        defaultValue="Doe"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={userData.email}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+1 (123) 456-7890"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium">Change Password</h3>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div className="rounded-lg border border-gray-200 p-6">
                <h2 className="mb-6 text-xl font-medium">Payment Methods</h2>
                
                <div className="mb-6 rounded-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100">
                        <CreditCard size={20} />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <div>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Default
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="mb-4 flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800"
                >
                  <span className="mr-2">+</span> Add Payment Method
                </button>
                
                <p className="mt-4 text-sm text-gray-500">
                  Your payment information is stored securely and is only used for processing transactions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 