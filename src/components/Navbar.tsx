'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import {
  INSTAGRAM_LINK,
  TIKTOK_LINK,
} from 'src/links';
import CustomLogo from './CustomLogo';
import Link from 'next/link';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  X, 
  Heart, 
  ChevronDown, 
  User, 
  Clock, 
  LogOut, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  Percent,
  Shirt, 
  Footprints,
  Glasses,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  LifeBuoy,
  Mail
} from 'lucide-react';
import SearchBar from './SearchBar';
import { BANNER_EVENTS } from './Banner';
import { usePathname } from 'next/navigation';
import { SearchDialog } from './ui/SearchDialog';
import { Button } from './ui/button';

export default function Navbar() {
  const { quantities, setShowModal } = useOnchainStoreContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  // Handle dropdown menu outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effects
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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleDropdown = (name: string) => {
    setDropdownOpen(prev => prev === name ? null : name);
  };

  const handleCartClick = () => {
    setShowModal?.(true);
  };

  // Categories list for the dropdown
  const categories = [
    { name: "Men's Fashion", href: "/categories/mens", icon: <Shirt size={18} /> },
    { name: "Women's Fashion", href: "/categories/womens", icon: <Shirt size={18} /> },
    { name: "Accessories", href: "/categories/accessories", icon: <Glasses size={18} /> },
    { name: "Footwear", href: "/categories/footwear", icon: <Footprints size={18} /> },
    { name: "New Arrivals", href: "/categories/new-arrivals", icon: <Sparkles size={18} /> },
    { name: "Sale", href: "/categories/sale", icon: <Percent size={18} /> },
  ];

  // Account options list for dropdown
  const accountOptions = [
    { name: "My Account", href: "/account", icon: <User size={18} /> },
    { name: "Order History", href: "/account/orders", icon: <Clock size={18} /> },
    { name: "Wishlist", href: "/wishlist", icon: <Heart size={18} /> },
    { name: "Logout", href: "/auth/logout", icon: <LogOut size={18} /> },
  ];

  return (
    <>
      <header 
        className={cn(
          "duration-200 fixed left-0 right-0 top-0 transition-all z-[110]", 
          scrolled ? "bg-white backdrop-blur-sm shadow-sm" : "bg-white",
          bannerVisible && "top-6"
        )}
      >
        <div className="mx-auto w-full">
          {/* Desktop Layout */}
          <div className="hidden h-16 md:block">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-6">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                  <CustomLogo />
                </Link>
                
                {/* Navigation Links */}
                <nav className="hidden items-center space-x-6 md:flex">
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      type="button"
                      onClick={() => toggleDropdown('categories')}
                      className={cn(
                        "flex font-medium items-center space-x-1",
                        dropdownOpen === 'categories' ? "text-black" : "hover:text-black text-zinc-700"
                      )}
                    >
                      <span>Categories</span>
                      <ChevronDown size={16} className={cn(
                        "transition-transform",
                        dropdownOpen === 'categories' && "rotate-180"
                      )} />
                    </button>
                    
                    {/* Categories Dropdown */}
                    {dropdownOpen === 'categories' && (
                      <div className="absolute bg-white left-0 mt-1 p-4 ring-1 ring-black/5 rounded-lg shadow-lg top-full w-64 z-50">
                        <div className="gap-1 grid grid-cols-1">
                          {categories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="flex font-medium hover:bg-zinc-50 hover:text-black items-center px-3 py-2 rounded-md space-x-2 text-sm text-zinc-700 transition-colors"
                              onClick={() => setDropdownOpen(null)}
                            >
                              <span className="text-zinc-500">{category.icon}</span>
                              <span>{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href="/products" 
                    className={cn(
                      "flex font-medium items-center space-x-1",
                      pathname === '/products' ? "text-black" : "hover:text-black text-zinc-700"
                    )}
                  >
                    <ShoppingBag size={18} className="mr-1" />
                    <span>Shop All</span>
                  </Link>
                  
                  <Link 
                    href="/wishlist" 
                    className="flex font-medium hover:text-black items-center space-x-1 text-zinc-700"
                  >
                    <Heart size={18} className="mr-1" />
                    <span>Wishlist</span>
                    {quantities.wishlistItemCount > 0 && (
                      <span className="bg-zinc-100 flex h-5 items-center justify-center min-w-5 px-1.5 rounded-full text-xs">
                        {quantities.wishlistItemCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
              
              {/* Right Side - Search, Account, Cart */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden lg:block w-60">
                  <SearchBar />
                </div>
                
                {/* Search Icon (visible on medium screens) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={20} strokeWidth={1.5} className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
                
                {/* Account Dropdown */}
                <div className="hidden md:block relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('account')}
                    className={cn(
                      "flex hover:bg-zinc-100 hover:text-black items-center justify-center p-2 rounded-full text-zinc-700 transition-colors",
                      dropdownOpen === 'account' ? "bg-zinc-100 text-black" : ""
                    )}
                    aria-label="Account"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </button>
                  
                  {/* Account Dropdown Menu */}
                  {dropdownOpen === 'account' && (
                    <div className="absolute bg-white mt-1 p-2 right-0 ring-1 ring-black/5 rounded-lg shadow-lg w-56 z-50">
                      {accountOptions.map((option) => (
                        <Link
                          key={option.name}
                          href={option.href}
                          className="flex font-medium hover:bg-zinc-50 hover:text-black items-center px-3 py-2 rounded-md space-x-2 text-sm text-zinc-700 transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          <span className="text-zinc-500">{option.icon}</span>
                          <span>{option.name}</span>
                          {option.name === 'Wishlist' && quantities.wishlistItemCount > 0 && (
                            <span className="bg-zinc-100 flex h-5 items-center justify-center min-w-5 ml-auto px-1.5 rounded-full text-xs">
                              {quantities.wishlistItemCount}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Wishlist Link - Icon only on desktop */}
                <Link 
                  href="/wishlist" 
                  className="hidden hover:bg-zinc-100 hover:text-black items-center justify-center lg:hidden md:flex p-2 relative rounded-full text-zinc-700"
                  aria-label="Wishlist"
                >
                  <Heart size={20} strokeWidth={1.5} />
                  {quantities.wishlistItemCount > 0 && (
                    <span className="-right-1 -top-1 absolute bg-black flex font-medium h-5 items-center justify-center min-w-5 rounded-full text-[10px] text-white">
                      {quantities.wishlistItemCount}
                    </span>
                  )}
                </Link>
                
                {/* Cart Button */}
                <button
                  type="button"
                  className="flex hover:bg-zinc-100 hover:text-black items-center justify-center p-2 relative rounded-full text-zinc-700"
                  onClick={handleCartClick}
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  {quantities.cartItemCount > 0 && (
                    <span className="-right-1 -top-1 absolute bg-black flex font-medium h-5 items-center justify-center min-w-5 rounded-full text-[10px] text-white">
                      {quantities.cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Optimized */}
          <div className="flex h-16 items-center justify-between md:hidden px-4 border-b border-zinc-100">
            <div className="flex items-center">
              <button
                type="button"
                className="active:bg-zinc-200 flex h-10 hover:bg-zinc-100 items-center justify-center rounded-full text-zinc-700 transition-colors w-10"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X size={22} strokeWidth={1.5} />
                ) : (
                  <Menu size={22} strokeWidth={1.5} />
                )}
              </button>
            </div>

            <div className="-ml-10 flex flex-1 items-center justify-center">
              <Link href="/" className="flex items-center">
                <CustomLogo />
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="active:bg-zinc-200 flex h-10 hover:bg-zinc-100 items-center justify-center rounded-full text-zinc-700 transition-colors w-10"
                onClick={toggleSearch}
                aria-label="Search"
              >
                {isSearchOpen ? (
                  <X size={22} strokeWidth={1.5} />
                ) : (
                  <Search size={22} strokeWidth={1.5} />
                )}
              </button>

              <button
                type="button"
                className="active:bg-zinc-200 flex h-10 hover:bg-zinc-100 items-center justify-center relative rounded-full text-zinc-700 transition-colors w-10"
                onClick={handleCartClick}
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} strokeWidth={1.5} />
                {quantities.cartItemCount > 0 && (
                  <span className="-right-1 -top-1 absolute bg-teal-700 flex font-medium h-5 items-center justify-center min-w-5 rounded-full text-[10px] text-white">
                    {quantities.cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search - Enhanced */}
        {isSearchOpen && (
          <div className="bg-white border-b border-zinc-200 md:hidden shadow-sm">
            <div className="p-4">
              <SearchBar className="w-full" />
            </div>
            <div className="bg-zinc-50 flex items-center justify-between px-4 py-3">
              <button onClick={toggleSearch} className="font-medium hover:text-zinc-900 text-sm text-zinc-600">
                Cancel
              </button>
              <button className="font-medium hover:text-teal-800 text-sm text-teal-700">
                Search
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu - Animated slide-in with improved layout */}
      {isMenuOpen && (
        <div className="animate-in bg-white duration-300 fixed flex flex-col inset-0 md:hidden pt-16 slide-in-from-left z-[100]">
          {/* Header is now styled consistently with the rest of the UI */}
          <div className="bg-white border-b border-zinc-200 flex items-center justify-between px-4 py-3 sticky top-0 z-10">
            <h2 className="font-medium text-lg text-zinc-900">Menu</h2>
            <button
              type="button"
              className="active:bg-zinc-200 flex h-10 hover:bg-zinc-100 items-center justify-center rounded-full text-zinc-700 transition-colors w-10"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="overflow-y-auto p-4">
            {/* User greeting/avatar section */}
            <div className="border-b border-zinc-100 flex items-center mb-6 pb-4">
              <div className="bg-zinc-100 flex h-12 items-center justify-center rounded-full w-12">
                <User size={24} className="text-zinc-500" />
              </div>
              <div className="ml-3">
                <Link 
                  href="/account"
                  className="block font-medium hover:underline text-sm text-zinc-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in / Register
                </Link>
                <p className="text-xs text-zinc-500">Access your account</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="flex font-semibold items-center text-xs text-zinc-500 tracking-wider uppercase">
                  <ShoppingBag size={14} className="mr-2" />
                  Shop
                </h2>
                <nav className="gap-2 grid grid-cols-2">
                  <Link 
                    href="/products" 
                    className="bg-zinc-50 flex font-medium hover:bg-zinc-100 items-center p-3 rounded-md space-x-2 text-sm text-zinc-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Tag size={16} className="text-zinc-500" />
                    <span>Shop All</span>
                  </Link>
                  <Link 
                    href="/categories/new-arrivals" 
                    className="bg-zinc-50 flex font-medium hover:bg-zinc-100 items-center p-3 rounded-md space-x-2 text-sm text-zinc-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Sparkles size={16} className="text-zinc-500" />
                    <span>New Arrivals</span>
                  </Link>
                  <Link 
                    href="/categories/featured" 
                    className="bg-zinc-50 flex font-medium hover:bg-zinc-100 items-center p-3 rounded-md space-x-2 text-sm text-zinc-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Sparkles size={16} className="text-zinc-500" />
                    <span>Featured</span>
                  </Link>
                  <Link 
                    href="/categories/sale" 
                    className="bg-zinc-50 flex font-medium hover:bg-zinc-100 items-center p-3 rounded-md space-x-2 text-sm text-zinc-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Percent size={16} className="text-zinc-500" />
                    <span>Sale</span>
                  </Link>
                </nav>
              </div>
              
              <div className="space-y-2">
                <h2 className="flex font-semibold items-center text-xs text-zinc-500 tracking-wider uppercase">
                  <Shirt size={14} className="mr-2" />
                  Categories
                </h2>
                <div className="gap-2 grid grid-cols-2">
                  {categories.map((category) => (
                    <Link 
                      key={category.name}
                      href={category.href} 
                      className="bg-zinc-50 flex font-medium hover:bg-zinc-100 items-center p-3 rounded-md space-x-2 text-sm text-zinc-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-zinc-500">{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="flex font-semibold items-center text-xs text-zinc-500 tracking-wider uppercase">
                  <User size={14} className="mr-2" />
                  Account
                </h2>
                <nav className="space-y-2">
                  {accountOptions.map((option) => (
                    <Link 
                      key={option.name}
                      href={option.href} 
                      className="bg-zinc-50 flex font-medium hover:bg-zinc-100 items-center p-3 rounded-md space-x-2 text-sm text-zinc-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-zinc-500">{option.icon}</span>
                      <span>{option.name}</span>
                      {option.name === 'Wishlist' && quantities.wishlistItemCount > 0 && (
                        <span className="bg-zinc-200 flex h-5 items-center justify-center min-w-5 ml-auto px-1.5 rounded-full text-xs">
                          {quantities.wishlistItemCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="space-y-2">
                <h2 className="flex font-semibold items-center text-xs text-zinc-500 tracking-wider uppercase">
                  <LifeBuoy size={14} className="mr-2" />
                  Connect
                </h2>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={INSTAGRAM_LINK}
                    className="bg-gradient-to-tr flex from-purple-500 h-10 hover:opacity-90 items-center justify-center rounded-full text-white to-pink-500 w-10"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Instagram"
                    title="Follow us on Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://twitter.com"
                    className="bg-[#1DA1F2] flex h-10 hover:opacity-90 items-center justify-center rounded-full text-white w-10"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Twitter"
                    title="Follow us on Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="https://facebook.com"
                    className="bg-[#1877F2] flex h-10 hover:opacity-90 items-center justify-center rounded-full text-white w-10"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Facebook"
                    title="Follow us on Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href={TIKTOK_LINK}
                    className="bg-black flex h-10 hover:opacity-90 items-center justify-center rounded-full text-white w-10"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="TikTok"
                    title="Follow us on TikTok"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M15 2v16a4 4 0 0 1-4 4"/><path d="M9 16V8a4 4 0 0 1 4-4"/></svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    className="bg-[#FF0000] flex h-10 hover:opacity-90 items-center justify-center rounded-full text-white w-10"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="YouTube"
                    title="Subscribe on YouTube"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
                
                <div className="bg-zinc-50 mt-4 p-3 rounded-md">
                  <div className="flex items-center">
                    <Mail size={16} className="text-zinc-500" />
                    <span className="font-medium ml-2 text-sm text-zinc-900">Customer Support</span>
                  </div>
                  <a 
                    href="mailto:support@example.com" 
                    className="block hover:underline mt-1 text-xs text-zinc-500"
                  >
                    support@example.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top spacer to push content below fixed header */}
      <div className={cn(
        "h-14 md:h-16", 
        bannerVisible && "mt-6"
      )} />

      {/* Search Dialog */}
      <SearchDialog 
        open={showSearch} 
        onOpenChange={setShowSearch} 
      />
    </>
  );
}
