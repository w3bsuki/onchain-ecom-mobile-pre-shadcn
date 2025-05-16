'use client';

import { cn } from "@/lib/utils";
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { ShoppingCart, User, Home, Menu, X, ArrowRight } from 'lucide-react';
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
        <div className="fixed bottom-16 right-4 z-50 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          <Link href="/account/login" className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">Log In</Link>
          <Link href="/account/register" className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">Register</Link>
          <div className="my-1 border-t border-gray-100" />
          <Link href="/account" className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">My Account</Link>
          <Link href="/account/orders" className="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">My Orders</Link>
        </div>
      )}
      
      {/* Main menu drawer - full screen slide-in from right */}
      {showMainMenu && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="font-bold text-xl">Menu</h2>
            <button
              type="button"
              onClick={handleMainMenuToggle}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuCategories.map((category) => (
              <div key={category.title} className="mb-6 px-4">
                <h3 className="font-semibold mb-3 text-lg">{category.title}</h3>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center justify-between py-2 text-gray-600"
                        onClick={handleMainMenuToggle} // Close menu when link is clicked
                      >
                        <span>{link.name}</span>
                        <ArrowRight 
                          size={16} 
                          className="opacity-0 transform transition-all group-hover:opacity-100 group-hover:translate-x-1 text-gray-400" 
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
        <div className="grid grid-cols-5 h-16">
          {/* Home */}
          <Link 
            href="/" 
            className={cn(
              "flex flex-col items-center justify-center text-gray-600",
              "hover:bg-gray-50 hover:text-blue-600 active:bg-gray-100"
            )}
          >
            <Home size={22} strokeWidth={1.5} />
            <span className="mt-1 text-xs font-medium">Home</span>
          </Link>
          
          {/* Search - using the MobileProductSearch component */}
          <MobileProductSearch />
          
          {/* Cart */}
          <button
            type="button"
            className={cn(
              "flex flex-col items-center justify-center relative text-gray-600",
              "hover:bg-gray-50 hover:text-blue-600 active:bg-gray-100"
            )}
            onClick={() => setShowModal?.(true)}
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {quantities.cartItemCount > 0 && (
              <span className="absolute right-4 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
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
              "hover:bg-gray-50 hover:text-blue-600 active:bg-gray-100",
              showUserMenu && "bg-gray-100 text-blue-600"
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
              "hover:bg-gray-50 hover:text-blue-600 active:bg-gray-100"
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