import { useState, useEffect, useRef } from 'react';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchSkeleton } from './SearchSkeleton';
import { Search as SearchIcon, Clock, TrendingUp, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { products } = useOnchainStoreContext();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulated recent searches (in a real app, this would come from user's history)
  const recentSearches = ['hoodies', 'sneakers', 'jackets'];

  // Simulated popular searches (in a real app, this would be based on analytics)
  const popularSearches = ['new arrivals', 'sale', 'accessories', 'summer'];

  // Filter products based on search query
  const filteredProducts = debouncedQuery
    ? products.filter(product =>
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 5)
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

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleProductSelect = (productId: string) => {
    router.push(`/products/${productId}`);
    onOpenChange(false);
  };

  const handleSearchTermSelect = (term: string) => {
    setQuery(term);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-[650px] overflow-hidden">
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              ref={inputRef}
              placeholder="Search products..."
              className="border-none focus:ring-0 focus-visible:ring-0 flex-1 py-3 pl-0"
              value={query}
              onValueChange={setQuery}
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4 opacity-50" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <div className="relative">
            <CommandList className="max-h-[calc(85vh-80px)] overflow-y-auto px-1 py-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                </div>
              ) : query ? (
                <>
                  <CommandEmpty className="py-6 text-center text-sm">
                    No products found for "{query}"
                  </CommandEmpty>
                  {filteredProducts.length > 0 && (
                    <CommandGroup heading="Products">
                      {filteredProducts.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => handleProductSelect(product.id)}
                          className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                        >
                          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-zinc-100 flex-shrink-0">
                            {product.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium truncate">{product.name}</span>
                            <span className="text-xs text-zinc-500">${product.price.toFixed(2)}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              ) : (
                <>
                  {recentSearches.length > 0 && (
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.map((term) => (
                        <CommandItem
                          key={term}
                          onSelect={() => handleSearchTermSelect(term)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Clock className="h-4 w-4 opacity-50" />
                          <span>{term}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  {popularSearches.length > 0 && (
                    <CommandGroup heading="Popular Searches">
                      <div className="flex flex-wrap gap-2 p-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearchTermSelect(term)}
                            className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-200"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
} 