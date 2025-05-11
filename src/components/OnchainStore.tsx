import { useState } from 'react';
import { Banner } from './Banner';
import Navbar from './Navbar';
import OnchainStoreCart from './OnchainStoreCart';
import OnchainStoreItems from './OnchainStoreItems';
import { OnchainStoreProvider } from './OnchainStoreProvider';
import Link from 'next/link';
import HeroFashion from './ui/hero-fashion';

export default function OnchainStore() {
  const [showModal, setShowModal] = useState(false);

  return (
    <OnchainStoreProvider>
      <div className="flex h-full w-full relative flex-col font-sansMono">
        <Banner />
        <Navbar />
        <main className="container mx-auto flex w-full flex-col pb-10 pt-[6.5rem] px-4 lg:px-6">
          {/* Mobile-only Hero (shown above everything on mobile) */}
          <div className="mb-6 block md:hidden">
            <HeroFashion />
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left column - fixed, no scrolling */}
            <div className="hidden md:block md:w-[320px] md:shrink-0">
              {/* Hero component */}
              <div className="fixed top-[6.5rem] w-[320px]">
                <div className="overflow-hidden">
                  <HeroFashion />
                </div>
              </div>
            </div>
            
            {/* Separator line - visible only on desktop */}
            <div className="hidden md:block md:w-[1px] md:mx-8 bg-gray-200" />
            
            {/* Right column - scrollable for products */}
            <div className="relative flex-1">
              {/* Top padding to prevent scrolling into navbar */}
              <div className="md:absolute md:inset-x-0 md:top-0 md:h-2 md:z-10 md:bg-white" />
              
              <div className="md:h-[calc(100vh-11rem)] md:overflow-y-auto md:scrollbar-thin">
                <OnchainStoreItems />
              </div>
            </div>
          </div>
          
          <OnchainStoreCart showModal={showModal} setShowModal={setShowModal} />
          
          <div className="mt-4 text-center">
            <Link href="/medusa-test" className="text-blue-500 text-sm hover:underline">
              Medusa Integration Test
            </Link>
            <span className="mx-2">|</span>
            <Link href="/image-proxy-test" className="text-blue-500 text-sm hover:underline">
              Image Loading Test
            </Link>
          </div>
        </main>
      </div>
    </OnchainStoreProvider>
  );
}
