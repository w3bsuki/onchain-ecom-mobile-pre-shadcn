'use client';

import { 
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerOverlay
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import { useProducts } from '@/hooks/medusa/useProducts';
import { demoProducts } from '@/lib/demo-products';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {  
  const { quantities, setQuantity: updateQuantity, removeFromCart } = useOnchainStoreContext() ?? {};
  const { data: fetchedProducts, isLoading } = useProducts();
  
  const cartItems = useMemo(() => {
    const products = fetchedProducts?.length ? fetchedProducts : demoProducts;
    return Object.entries(quantities ?? {}).map(([id, quantity]) => {
      const product = products.find(p => p.id === id);
      return product ? { ...product, quantity } : null;
    }).filter((item): item is CartItem => item !== null);
  }, [quantities, fetchedProducts]);

  const subtotal = useMemo(() => 
    cartItems.reduce((acc: number, item) => acc + (item.price * item.quantity), 0)
  , [cartItems]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerOverlay className="fixed inset-0 bg-black/40" />
      <DrawerPortal>
        <DrawerContent className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col border-l bg-white py-4 shadow-lg outline-none md:w-[400px]">
          <div className="flex h-full flex-col">
            <div className="sticky top-0 z-20 border-b bg-white px-4 py-4">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="text-lg font-medium">Shopping Cart</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mr-2"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close cart</span>
                </Button>
              </div>              {cartItems.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </div>
              )}
            </div>

            {!cartItems.length ? (
              <div className="flex flex-1 flex-col items-center justify-center space-y-4 px-4">
                <div className="text-center">
                  <div className="text-lg font-medium">Your cart is empty</div>
                  <div className="text-sm text-muted-foreground">
                    Add items to your cart to see them here.
                  </div>
                </div>
                <Button onClick={() => onOpenChange(false)} className="w-full max-w-[240px]">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4">
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 py-4">
                        <div className="relative h-24 w-24 flex-none rounded-lg border bg-zinc-50">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                              width={96}
                              height={96}
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <div className="pr-4 font-medium">{item.name}</div>
                              <div className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            <div className="mt-1 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-sm text-muted-foreground"
                                onClick={() => removeFromCart(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-0 border-t bg-white px-4 py-4">
                  <div className="mb-4 flex items-center justify-between font-medium">
                    <div>Subtotal</div>
                    <div>${subtotal.toFixed(2)}</div>
                  </div>
                  <Link href="/cart" className={cn("block")}>
                    <Button size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
