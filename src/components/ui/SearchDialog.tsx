import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchSkeleton } from './SearchSkeleton';
import { Search as SearchIcon, Clock, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import Link from 'next/link';
import { Button } from './button';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { products } = useOnchainStoreContext();

  // Simulated recent searches (in a real app, this would come from user's history)
  const recentSearches = ['hoodies', 'sneakers', 'jackets'];

  // Simulated popular searches (in a real app, this would be based on analytics)
  const popularSearches = ['new arrivals', 'sale', 'accessories', 'summer'];

  // Filter products based on search query
  const filteredProducts = debouncedQuery
    ? products.filter(product =>
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  // Simulate loading state when query changes
  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [debouncedQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 outline-none">
        <div className="sticky inset-x-0 top-0 bg-white p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search products..."
              className="pl-9 pr-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4 text-zinc-500" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </div>

        <div className="h-full overflow-y-auto overscroll-contain px-4 pb-4">
          {isLoading ? (
            <SearchSkeleton showResults={true} />
          ) : query ? (
            <div className="space-y-6">
              {filteredProducts.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-zinc-500">Products</h3>
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center space-x-3 rounded-lg border border-transparent p-2 transition hover:border-zinc-200 hover:bg-zinc-50"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-zinc-100">
                          {product.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-zinc-900">{product.name}</h4>
                          <p className="text-sm text-zinc-500">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-zinc-500">No products found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recent searches */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-500">
                  <Clock className="h-4 w-4" />
                  Recent searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      className="flex w-full items-center space-x-2 rounded-lg p-2 text-left text-sm text-zinc-900 transition hover:bg-zinc-50"
                      onClick={() => setQuery(search)}
                    >
                      <Clock className="h-4 w-4 text-zinc-400" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular searches */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-500">
                  <TrendingUp className="h-4 w-4" />
                  Popular searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      className="rounded-full bg-zinc-50 px-3 py-1.5 text-sm text-zinc-900 transition hover:bg-zinc-100"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 