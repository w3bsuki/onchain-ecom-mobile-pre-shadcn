'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { cn } from "@/lib/utils";
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import Link from 'next/link';
import { MobileCategorySidebar } from '../ui/MobileCategorySidebar';
import { SearchDialog } from '../search/SearchDialog';
import { CartDrawer } from '../cart/CartDrawer';
import { Button } from '@/components/ui/button';
import CustomLogo from '../CustomLogo';

// Replace Lucide icons with React Icons
import { 
  FiSearch, 
  FiShoppingCart, 
  FiChevronDown, 
  FiUser, 
  FiClock, 
  FiLogOut
} from 'react-icons/fi';

import {
  IoShirtOutline,
  IoFootstepsOutline,
  IoGlassesOutline,
  IoStarOutline
} from 'react-icons/io5';

import {
  BsCreditCard2Front,
  BsGrid
} from 'react-icons/bs';

import { FaHeart } from 'react-icons/fa';

// Type definitions for better type safety
interface NavState {
  cart: boolean;
  menu: boolean;
  search: boolean;
  dropdown: string | null;
}

type NavStateValue = boolean | string | null;

interface Category {
  name: string;
  href: string;
  icon: JSX.Element;
  highlight?: boolean;
  badge?: string;
  subcategories?: Array<{
    name: string;
    href: string;
  }>;
}

interface AccountOption {
  name: string;
  href: string;
  icon: JSX.Element;
}

// Memoized NavItem component for better performance
const NavItem = memo(function NavItem({ 
  category, 
  isActive, 
  onClick 
}: { 
  category: Category; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center rounded-md px-3.5 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white",
        isActive && "text-white",
        category.highlight && "font-semibold text-white"
      )}
    >
      <span className="mr-2">{category.icon}</span>
      <span>{category.name}</span>
      {category.subcategories && (
        <FiChevronDown 
          size={16} 
          className={cn(
            "ml-1 transition-transform", 
            isActive && "rotate-180"
          )} 
        />
      )}
      {category.badge && (
        <span className="ml-1.5 rounded-sm bg-white/20 px-1.5 py-0.5 text-[10px] font-medium">
          {category.badge}
        </span>
      )}
    </button>
  );
});

// Memoized AccountOption component
const AccountMenuItem = memo(function AccountMenuItem({
  option,
  badgeCount,
  onClick
}: {
  option: AccountOption;
  badgeCount?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={option.href}
      className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-black"
      onClick={onClick}
    >
      <span className="text-zinc-500">{option.icon}</span>
      <span>{option.name}</span>
      {option.name === 'Wishlist' && badgeCount && badgeCount > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 px-1.5 text-xs">
          {badgeCount}
        </span>
      )}
    </Link>
  );
});

// Memoized dropdown component for better performance
const CategoryDropdown = memo(function CategoryDropdown({
  category,
  dropdownRef
}: {
  category: Category;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) {
  if (!category.subcategories) {
    return null;
  }
  
  return (
    <div 
      ref={dropdownRef}
      className="absolute left-0 top-full z-20 mt-1 w-56 rounded-md bg-zinc-900 py-2 shadow-lg"
    >
      {category.subcategories.map((subcategory) => (
        <Link 
          key={subcategory.name}
          href={subcategory.href}
          className="block px-4 py-2 text-sm text-white/80 hover:bg-zinc-800 hover:text-white"
        >
          {subcategory.name}
        </Link>
      ))}
    </div>
  );
});

// Main Navbar component
export default function Navbar() {
  const { quantities } = useOnchainStoreContext();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [navState, setNavState] = useState<NavState>({
    cart: false,
    menu: false,
    search: false,
    dropdown: null
  });

  // Handle dropdown menu outside clicks - optimized with useCallback
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        updateNavState('dropdown', null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effects - optimized with useCallback
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized state update function with useCallback
  const updateNavState = useCallback((key: keyof NavState, value: NavStateValue) => {
    setNavState(prev => {
      const newState = { ...prev } as NavState;
      
      if (value && (key === 'cart' || key === 'menu' || key === 'search')) {
        newState.cart = key === 'cart' ? Boolean(value) : false;
        newState.menu = key === 'menu' ? Boolean(value) : false;
        newState.search = key === 'search' ? Boolean(value) : false;
      } else if (key === 'dropdown') {
        newState.dropdown = value as string | null;
      } else {
        newState[key] = value as boolean;
      }
      
      return newState;
    });
  }, []);

  // Event handlers optimized with useCallback
  const toggleSearch = useCallback(() => updateNavState('search', !navState.search), [updateNavState, navState.search]);
  
  const toggleDropdown = useCallback((name: string) => {
    updateNavState('dropdown', navState.dropdown === name ? null : name);
  }, [updateNavState, navState.dropdown]);
  
  const handleCartClick = useCallback(() => updateNavState('cart', true), [updateNavState]);
  
  // Categories data - extracted to constant
  const categories: Category[] = [
    { 
      name: "Men's Apparel",
      href: "/categories/mens",
      icon: <IoShirtOutline size={18} />,
      subcategories: [
        { name: "T-Shirts & Polos", href: "/categories/mens/t-shirts" },
        { name: "Hoodies & Sweatshirts", href: "/categories/mens/hoodies" },
        { name: "Jackets & Coats", href: "/categories/mens/jackets" },
        { name: "Jeans & Pants", href: "/categories/mens/pants" },
      ]
    },
    { 
      name: "Women's Apparel",
      href: "/categories/womens",
      icon: <IoShirtOutline size={18} />,
      subcategories: [
        { name: "Dresses & Skirts", href: "/categories/womens/dresses" },
        { name: "Tops & Blouses", href: "/categories/womens/tops" },
        { name: "Sweaters & Cardigans", href: "/categories/womens/sweaters" },
        { name: "Pants & Leggings", href: "/categories/womens/pants" },
      ]
    },
    { 
      name: "Footwear",
      href: "/categories/footwear",
      icon: <IoFootstepsOutline size={18} />,
      subcategories: [
        { name: "Sneakers", href: "/categories/footwear/sneakers" },
        { name: "Athletic Shoes", href: "/categories/footwear/athletic" },
        { name: "Boots", href: "/categories/footwear/boots" },
        { name: "Sandals", href: "/categories/footwear/sandals" },
      ]
    },
    { 
      name: "Accessories",
      href: "/categories/accessories",
      icon: <IoGlassesOutline size={18} />,
      subcategories: [
        { name: "Bags & Wallets", href: "/categories/accessories/bags" },
        { name: "Jewelry", href: "/categories/accessories/jewelry" },
        { name: "Watches", href: "/categories/accessories/watches" },
        { name: "Hats & Scarves", href: "/categories/accessories/hats" },
      ]
    },
    { 
      name: "New Arrivals",
      href: "/categories/new-arrivals",
      icon: <IoStarOutline size={18} />,
      highlight: true
    },
    { 
      name: "Sale",
      href: "/categories/sale",
      icon: <BsCreditCard2Front size={18} />,
      highlight: true,
      badge: "Up to 70% Off"
    },
  ];

  const accountOptions: AccountOption[] = [
    { name: "My Account", href: "/account", icon: <FiUser size={18} /> },
    { name: "Order History", href: "/account/orders", icon: <FiClock size={18} /> },
    { name: "Wishlist", href: "/wishlist", icon: <FaHeart size={18} /> },
    { name: "Logout", href: "/auth/logout", icon: <FiLogOut size={18} /> },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed left-0 right-0 top-0 z-[80] bg-black/90 backdrop-blur-sm duration-200 transition-all",
          scrolled && "shadow-md",
          "top-[36px] sm:top-[44px]"
        )}
      >
        <div className="mx-auto px-3 sm:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Left side - Menu button (mobile) */}
            <div className="flex md:hidden">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => updateNavState('menu', !navState.menu)}
                className="h-10 w-10 rounded-full text-white"
                aria-label="Open menu"
              >
                <BsGrid size={22} />
              </Button>
            </div>

            {/* Logo - Centered on mobile, left-aligned on desktop */}
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center md:static md:left-auto md:translate-x-0">
              <Link 
                href="/"
                className="scale-90 transition-transform hover:scale-[0.88] active:scale-[0.87] sm:scale-100 sm:hover:scale-[0.98]"
                onClick={() => updateNavState('dropdown', null)}
              >
                <CustomLogo />
              </Link>
              
              {/* Desktop Navigation - hidden on mobile */}
              <nav className="ml-8 hidden items-center space-x-2 md:flex">
                {categories.map((category) => (
                  <div key={category.name} className="relative">
                    <NavItem
                      category={category}
                      isActive={navState.dropdown === category.name}
                      onClick={() => toggleDropdown(category.name)}
                    />

                    {/* Dropdown for category with subcategories */}
                    {category.subcategories && navState.dropdown === category.name && (
                      <CategoryDropdown 
                        category={category}
                        dropdownRef={dropdownRef}
                      />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Desktop Search - hidden on mobile */}
              <div className="hidden w-60 lg:block">
                <SearchDialog
                  open={navState.search} 
                  onOpenChange={(open) => updateNavState('search', open)}
                />
              </div>

              {/* Mobile Search Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white md:hidden"
                onClick={toggleSearch}
              >
                <FiSearch size={22} />
                <span className="sr-only">Search</span>
              </Button>

              {/* Account Dropdown (desktop only) */}
              <div className="relative hidden md:block">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleDropdown('account')}
                  className={cn(
                    "text-zinc-200 hover:text-white",
                    navState.dropdown === 'account' && "text-white"
                  )}
                >
                  <FiUser size={22} />
                </Button>

                {navState.dropdown === 'account' && (
                  <div className="absolute right-0 top-full z-[120] mt-1 w-48 animate-in rounded-lg bg-white/95 p-2 backdrop-blur-sm fade-in slide-in-from-top-2 ring-1 ring-black/5 shadow-lg duration-200">
                    {accountOptions.map((option) => (
                      <AccountMenuItem
                        key={option.name}
                        option={option}
                        badgeCount={option.name === 'Wishlist' ? quantities?.wishlistItemCount : undefined}
                        onClick={() => updateNavState('dropdown', null)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Cart Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon" 
                className="relative h-10 w-10 rounded-full text-white"
                onClick={handleCartClick}
              >
                <FiShoppingCart size={22} />
                {quantities?.cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] font-medium text-white">
                    {quantities.cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Panel */}
        {navState.search && (
          <div className="animate-in slide-in-from-top md:hidden duration-200">
            <div className="border-b border-zinc-200 bg-white p-3">
              <SearchDialog
                open={navState.search} 
                onOpenChange={(open) => updateNavState('search', open)}
              />
              <div className="mt-3 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleSearch}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileCategorySidebar 
        categories={categories}
        accountOptions={accountOptions}
        isOpen={navState.menu}
        onClose={() => updateNavState('menu', false)}
      />

      {/* Cart Modal */}
      <CartDrawer
        open={navState.cart}
        onOpenChange={(open: boolean) => updateNavState('cart', open)}
      />
    </>
  );
}
