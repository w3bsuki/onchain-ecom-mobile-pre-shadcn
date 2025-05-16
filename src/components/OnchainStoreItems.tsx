import OnchainStoreItem from './OnchainStoreItem';
import SkeletonProductCard from './SkeletonProductCard';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { useEffect, useState } from 'react';

export default function OnchainStoreItems() {
  const { products, loading } = useOnchainStoreContext();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Track if this is the first load to show skeleton instead of spinner
  useEffect(() => {
    if (!loading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [loading, isFirstLoad]);

  // Show skeleton placeholders on first load
  if (loading && isFirstLoad) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    );
  }

  // Show spinner for subsequent loading states
  if (loading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800 mb-3" />
          <p className="text-gray-600 text-sm font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-lg bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
          <p className="text-gray-600">We couldn't find any products matching your criteria. Try adjusting your filters or check back later for new arrivals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 pb-12">
      {products.map((item) => (
        <OnchainStoreItem {...item} key={item.id} />
      ))}
    </div>
  );
}
