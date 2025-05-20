'use client';

import { cn } from "@/lib/utils";
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { ShoppingCart, User, Home, Menu, X, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import MobileProductSearch from './MobileProductSearch';

export default function MobileBottomNav() {
  const { quantities, setShowModal } = useOnchainStoreContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  
  const handleUserMenuToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu(prev => !prev);
  }, []);
  
  const handleMainMenuToggle = () => {
    setShowMainMenu(prev => !prev);
    // When opening menu, prevent body scroll
    if (!showMainMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  // Close the user menu when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (showUserMenu) {
      setShowUserMenu(false);
    }
  }, [showUserMenu]);
  
  // Add event listener on component mount
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Reset body overflow when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, [handleClickOutside]);

  // Main menu categories with links
  const menuCategories = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/' },
        { name: 'New Arrivals', href: '/' },
        { name: 'Featured', href: '/' },
        { name: 'Sale', href: '/' },
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Shoes', href: '/' },
        { name: 'Shirts', href: '/' },
        { name: 'Hats', href: '/' },
        { name: 'Accessories', href: '/' },
        { name: 'Eyewear', href: '/' },
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'My Account', href: '/account' },
        { name: 'Order History', href: '/account/orders' },
        { name: 'Saved Items', href: '/' },
        { name: 'Settings', href: '/' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/' },
        { name: 'Contact', href: '/' },
        { name: 'Terms of Service', href: '/legal/terms' },
        { name: 'Privacy Policy', href: '/legal/privacy-policy' },
      ]
    }
  ];

  return (
    <>
      {/* User menu dropdown */}
      {showUserMenu && (
        <div className="fixed bottom-16 right-4 z-50 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
          <Link href="/account/login" className="block px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100">Log In</Link>
          <Link href="/account/register" className="block px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100">Register</Link>
          <div className="my-1 border-t border-gray-200" />
          <Link href="/account" className="block px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100">My Account</Link>
          <Link href="/account/orders" className="block px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100">My Orders</Link>
        </div>
      )}
      
      {/* Main menu drawer - full screen slide-in from right */}
      {showMainMenu && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h2 className="font-semibold text-xl text-gray-900">Menu</h2>
            <button
              type="button"
              onClick={handleMainMenuToggle}
              className="rounded-full p-3 text-gray-500 hover:bg-gray-100 active:bg-gray-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto py-6">
            {menuCategories.map((category) => (
              <div key={category.title} className="mb-8 px-4">
                <h3 className="font-semibold mb-4 text-lg text-gray-900">{category.title}</h3>
                <ul className="space-y-1">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center justify-between py-3 text-gray-600 hover:text-gray-900 active:bg-gray-50"
                        onClick={handleMainMenuToggle} // Close menu when link is clicked
                      >
                        <span className="text-base">{link.name}</span>
                        <ArrowRight 
                          size={18} 
                          className="opacity-0 transform transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 text-gray-400" 
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg md:hidden">
        <div className="grid h-16 grid-cols-5">
          {/* Home */}
          <Link 
            href="/" 
            className={cn(
              "flex flex-col items-center justify-center text-gray-600",
              "hover:text-teal-700 active:text-teal-600 transition-colors",
              "h-full min-w-[3rem] px-1"
            )}
          >
            <Home size={22} strokeWidth={1.5} />
            <span className="mt-1 text-xs font-medium">Home</span>
          </Link>
          
          {/* Search */}
          <Link
            href="/search"
            className={cn(
              "flex flex-col items-center justify-center text-gray-600",
              "hover:text-teal-700 active:text-teal-600 transition-colors",
              "h-full min-w-[3rem] px-1"
            )}
          >
            <Search size={22} strokeWidth={1.5} />
            <span className="mt-1 text-xs font-medium">Search</span>
          </Link>
          
          {/* Cart */}
          <button
            type="button"
            className={cn(
              "flex flex-col items-center justify-center relative text-gray-600",
              "hover:text-teal-700 active:text-teal-600 transition-colors",
              "h-full min-w-[3rem] px-1"
            )}
            onClick={() => setShowModal?.(true)}
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {quantities.cartItemCount > 0 && (
              <span className="absolute right-3 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[10px] font-medium text-white">
                {quantities.cartItemCount}
              </span>
            )}
            <span className="mt-1 text-xs font-medium">Cart</span>
          </button>
          
          {/* Account */}
          <button
            type="button"
            className={cn(
              "flex flex-col items-center justify-center text-gray-600",
              "hover:text-teal-700 active:text-teal-600 transition-colors",
              "h-full min-w-[3rem] px-1",
              showUserMenu && "text-teal-700"
            )}
            onClick={handleUserMenuToggle}
          >
            <User size={22} strokeWidth={1.5} />
            <span className="mt-1 text-xs font-medium">Account</span>
          </button>
          
          {/* Menu */}
          <button
            type="button"
            className={cn(
              "flex flex-col items-center justify-center text-gray-600",
              "hover:text-teal-700 active:text-teal-600 transition-colors",
              "h-full min-w-[3rem] px-1"
            )}
            onClick={handleMainMenuToggle}
          >
            <Menu size={22} strokeWidth={1.5} />
            <span className="mt-1 text-xs font-medium">Menu</span>
          </button>
        </div>
      </nav>
      
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
} 