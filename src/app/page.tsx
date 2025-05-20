'use client';
import OnchainStore from 'src/components/OnchainStore';
import HeroCarousel from '@/components/ui/hero-carousel';
import { OnchainStoreProvider } from 'src/components/OnchainStoreProvider';
import { FeaturedProducts } from '@/components/ui/FeaturedProducts';

export default function Page() {
  return (
    <OnchainStoreProvider>
      <main className="min-h-screen">
        <HeroCarousel />
        
        <section className="container mx-auto py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <FeaturedProducts />
        </section>
        
        <OnchainStore />
      </main>
    </OnchainStoreProvider>
  );
}
