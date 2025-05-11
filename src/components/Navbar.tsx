'use client';

import { cn, pressable } from '@coinbase/onchainkit/theme';
import { useCallback, useState } from 'react';
import {
  INSTAGRAM_LINK,
  TIKTOK_LINK,
  TWITTER_LINK,
} from 'src/links';
import { ExternalLinkSvg } from 'src/svg/ExternalLinkSvg';
import { MenuSvg } from 'src/svg/MenuSvg';
import CustomLogo from './CustomLogo';
import { Separator } from './ui/separator';
import type { NavbarLinkReact } from 'src/types';
import Link from 'next/link';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';

function NavbarLink({ link, label }: NavbarLinkReact) {
  return (
    <li
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2 rounded p-1',
        pressable.default,
      )}
    >
      <a
        href={link}
        className="ock-text-foreground flex items-center text-sm"
        target="_blank"
        rel="noreferrer"
      >
        {label}
        <span className="pl-1">
          <ExternalLinkSvg />
        </span>
      </a>
    </li>
  );
}

export default function Navbar() {
  const { quantities } = useOnchainStoreContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header className="-mx-[50vw] bg-[white] fixed left-1/2 right-1/2 top-10 w-screen z-20 xs:h-14">
        <div className="h-full items-center max-w-7xl mx-auto px-4 py-4 lg:px-6">
          {/* Desktop Layout */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <CustomLogo />
              </Link>
              <nav>
                <ul className="flex space-x-8">
                  <NavbarLink link={INSTAGRAM_LINK} label="INSTAGRAM" />
                  <NavbarLink link={TIKTOK_LINK} label="TIKTOK" />
                  <NavbarLink link={TWITTER_LINK} label="X" />
                </ul>
              </nav>
            </div>
            
            <div className="flex flex-1 items-center justify-end space-x-8">
              <div className="w-[400px]">
                <SearchBar />
              </div>

              {/* Account & Cart */}
              <div className="flex items-center space-x-4">
                {/* User Account */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    title="User menu"
                  >
                    <User size={20} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute bg-white mt-2 py-1 right-0 rounded-md ring-1 ring-black ring-opacity-5 shadow-lg w-48">
                      <Link href="/account/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log In</Link>
                      <Link href="/account/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register</Link>
                      <div className="border-t border-gray-100 my-1" />
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                      <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                    </div>
                  )}
                </div>

                {/* Shopping Cart */}
                <button
                  type="button"
                  className="flex items-center p-1 relative rounded-full hover:bg-gray-100"
                  onClick={() => setShowModal?.(true)}
                  title="Shopping cart"
                >
                  <ShoppingCart size={20} />
                  {quantities.cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 bg-black flex h-4 items-center justify-center rounded-full text-[10px] text-white w-4">
                      {quantities.cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex items-center md:hidden relative w-full">
            <div className="flex flex-grow justify-center">
              <Link href="/" className="flex items-center">
                <CustomLogo />
              </Link>
            </div>
            <button
              type="button"
              className={cn('absolute -translate-y-1/2 right-0 top-1/2', pressable.default)}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              title="Toggle menu"
            >
              <MenuSvg />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="bg-[white] md:hidden">
            <div className="px-4 py-2">
              <SearchBar />
            </div>
            <ul className="flex flex-col items-start space-y-2 px-4 pb-4">
              <NavbarLink link={INSTAGRAM_LINK} label="INSTAGRAM" />
              <NavbarLink link={TIKTOK_LINK} label="TIKTOK" />
              <NavbarLink link={TWITTER_LINK} label="X" />
            </ul>
          </div>
        )}
      </header>
      <div className="-mx-[50vw] fixed left-1/2 right-1/2 top-[5.5rem] z-10 w-screen">
        <div className="mx-auto max-w-7xl">
          <Separator className="w-full" />
        </div>
      </div>
    </>
  );
}
