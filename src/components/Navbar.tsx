'use client';

import { cn } from '@coinbase/onchainkit/theme';
import { useCallback, useState, useEffect } from 'react';
import {
  INSTAGRAM_LINK,
  TIKTOK_LINK,
} from 'src/links';
import CustomLogo from './CustomLogo';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { ShoppingCart, User } from 'lucide-react';
import SearchBar from './SearchBar';
import { BANNER_EVENTS } from './Banner';
import { ExternalLinkSvg } from 'src/svg/ExternalLinkSvg';

export default function Navbar() {
  const { quantities, setShowModal } = useOnchainStoreContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for banner visibility changes
  useEffect(() => {
    const handleBannerVisibilityChange = (e: CustomEvent) => {
      setBannerVisible(e.detail.isVisible);
    };

    window.addEventListener(
      BANNER_EVENTS.VISIBILITY_CHANGE,
      handleBannerVisibilityChange as EventListener
    );

    return () => {
      window.removeEventListener(
        BANNER_EVENTS.VISIBILITY_CHANGE,
        handleBannerVisibilityChange as EventListener
      );
    };
  }, []);

  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header 
        className={cn(
          "fixed left-0 right-0 top-10 z-30 w-full bg-white transition-all duration-300", 
          scrolled && "shadow-sm"
        )}
        style={{
          top: bannerVisible ? '24px' : '0',
        }}
      >
        <div className="w-full">
          <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6">
            {/* Desktop Layout */}
            <div className="hidden h-12 w-full items-center justify-between md:flex">
              <div className="flex items-center space-x-10">
                {/* Logo with no separator */}
                <div className="relative flex items-center">
                  <Link href="/" className="flex items-center">
                    <CustomLogo />
                  </Link>
                </div>
                
                {/* Social links in a clean single row with original styling */}
                <div className="flex items-center space-x-8">
                  <a
                    href={INSTAGRAM_LINK}
                    className="group relative flex items-center text-sm font-medium tracking-wider"
                    target="_blank"
                    rel="noreferrer"
                  >
                    INSTAGRAM
                    <span className="pl-1 transition-transform duration-200 group-hover:translate-x-0.5">
                      <ExternalLinkSvg />
                    </span>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                  </a>
                  <a
                    href={TIKTOK_LINK}
                    className="group relative flex items-center text-sm font-medium tracking-wider"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TIKTOK
                    <span className="pl-1 transition-transform duration-200 group-hover:translate-x-0.5">
                      <ExternalLinkSvg />
                    </span>
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                  </a>
                </div>
              </div>
              
              <div className="flex flex-1 items-center justify-end space-x-8">
                <div className="w-[340px] lg:w-[400px]">
                  <SearchBar />
                </div>

                {/* Account & Cart */}
                <div className="flex items-center space-x-6">
                  {/* User Account */}
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center rounded-full p-1.5 transition-colors hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      title="User menu"
                    >
                      <User size={20} strokeWidth={1.5} />
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                        <Link href="/account/login" className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">Log In</Link>
                        <Link href="/account/register" className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">Register</Link>
                        <div className="my-1 border-t border-gray-100" />
                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">My Account</Link>
                        <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">My Orders</Link>
                      </div>
                    )}
                  </div>

                  {/* Shopping Cart */}
                  <button
                    type="button"
                    className="relative flex items-center rounded-full p-1.5 transition-colors hover:bg-gray-100"
                    onClick={() => setShowModal?.(true)}
                    title="Shopping cart"
                  >
                    <ShoppingCart size={20} strokeWidth={1.5} />
                    {quantities.cartItemCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                        {quantities.cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="relative flex w-full items-center justify-between py-2 md:hidden">
              <button
                type="button"
                className="p-2"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                )}
              </button>

              <div className="flex flex-grow justify-center">
                <Link href="/" className="flex items-center">
                  <CustomLogo />
                </Link>
              </div>

              <button
                type="button"
                className="relative p-2"
                onClick={() => setShowModal?.(true)}
                title="Shopping cart"
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {quantities.cartItemCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                    {quantities.cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <div className="space-y-4 px-4 py-4">
              <div className="pb-2">
                <SearchBar />
              </div>
              <div className="flex items-center space-x-8 pb-2">
                <a
                  href={INSTAGRAM_LINK}
                  className="group relative flex items-center text-sm font-medium tracking-wider"
                  target="_blank"
                  rel="noreferrer"
                >
                  INSTAGRAM
                  <span className="pl-1 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ExternalLinkSvg />
                  </span>
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                </a>
                <a
                  href={TIKTOK_LINK}
                  className="group relative flex items-center text-sm font-medium tracking-wider"
                  target="_blank"
                  rel="noreferrer"
                >
                  TIKTOK
                  <span className="pl-1 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ExternalLinkSvg />
                  </span>
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                </a>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <Link href="/account/login" className="block py-2 text-sm font-medium">Log In</Link>
                <Link href="/account/register" className="block py-2 text-sm font-medium">Register</Link>
                <Link href="/account" className="block py-2 text-sm font-medium">My Account</Link>
                <Link href="/account/orders" className="block py-2 text-sm font-medium">My Orders</Link>
              </div>
            </div>
          </div>
        )}
        
        <Separator className="w-full" />
      </header>
      <div className={cn(
        "transition-all duration-300",
        bannerVisible ? "h-[3rem] md:h-14" : "h-10 md:h-12"
      )} />
    </>
  );
}
