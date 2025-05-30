'use client';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, LogOut, Shirt, ShoppingBag, GlassesIcon, User, Clock, Heart, Percent } from 'lucide-react';
import { demoProducts } from '@/lib/demo-products';

interface CategoryItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  subcategories?: { name: string; href: string }[];
  highlight?: boolean;
  badge?: string;
}

interface AccountOption {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface MobileCategorySidebarProps {
  categories?: CategoryItem[];
  accountOptions?: AccountOption[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function MobileCategorySidebar({ 
  categories = [],
  accountOptions = [],
  isOpen = false,
  onClose = () => {}
}: MobileCategorySidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize with default categories if none provided
  const defaultCategories: CategoryItem[] = categories.length > 0 ? categories : [
    { 
      name: "Men's Apparel",
      href: "/categories/mens",
      icon: <Shirt size={18} strokeWidth={1.75} />,
      subcategories: [
        { name: "T-Shirts & Polos", href: "/categories/mens/t-shirts" },
        { name: "Hoodies & Sweatshirts", href: "/categories/mens/hoodies" },
      ]
    },
    { 
      name: "Women's Apparel",
      href: "/categories/womens",
      icon: <Shirt size={18} strokeWidth={1.75} />
    },
    { 
      name: "Footwear",
      href: "/categories/footwear",
      icon: <ShoppingBag size={18} strokeWidth={1.75} />
    },
    { 
      name: "Accessories",
      href: "/categories/accessories",
      icon: <GlassesIcon size={18} strokeWidth={1.75} />
    },
    { 
      name: "New Arrivals",
      href: "/categories/new-arrivals",
      icon: <ChevronRight size={18} />,
      highlight: true
    },
    { 
      name: "Sale",
      href: "/categories/sale",
      icon: <Percent size={18} />,
      highlight: true,
      badge: "Up to 70% Off"
    }
  ];
  
  // Initialize with default account options if none provided
  const defaultAccountOptions: AccountOption[] = accountOptions.length > 0 ? accountOptions : [
    { name: "My Account", href: "/account", icon: <User size={18} /> },
    { name: "Order History", href: "/account/orders", icon: <Clock size={18} /> },
    { name: "Wishlist", href: "/wishlist", icon: <Heart size={18} /> },
    { name: "Logout", href: "/auth/logout", icon: <LogOut size={18} /> }
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter main navigation items vs quick actions using the default or provided categories
  const mainNavItems = defaultCategories.filter(cat => cat.name !== "New Arrivals" && cat.name !== "Sale");
  const quickActions = defaultCategories.filter(cat => cat.name === "New Arrivals" || cat.name === "Sale");

  // If component hasn't mounted yet on the client, don't render anything to avoid hydration errors
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/25 backdrop-blur-[2px]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.5 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed inset-y-0 left-0 z-[120] w-full max-w-[320px] bg-white shadow-xl ring-1 ring-zinc-950/10"
          >
            <div className="flex h-full flex-col overflow-hidden">
              {/* Header */}
              <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 backdrop-blur-sm bg-white/[98%] sticky top-0 z-10">
                <h2 className="text-base font-semibold tracking-tight text-zinc-900">Browse Store</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 -m-1.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>

              {/* Featured Actions */}
              <div className="border-b border-zinc-200">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="group flex flex-col items-center gap-1.5 rounded-xl bg-zinc-950 px-3 py-3.5 text-white transition-colors duration-200 hover:bg-zinc-900 active:bg-zinc-800"
                      onClick={onClose}
                    >
                      <span className="text-zinc-400 transition-colors group-hover:text-zinc-300">{action.icon}</span>
                      <span className="text-sm font-medium tracking-tight">{action.name}</span>
                      {action.badge && (
                        <span className="mt-0.5 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-zinc-900">
                          {action.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Categories */}
              <ScrollArea className="flex-1 px-3">
                <div className="pt-2 pb-6">
                  <Accordion
                    type="multiple"
                    value={expandedSections}
                    onValueChange={setExpandedSections}
                    className="space-y-1.5"
                  >
                    {mainNavItems.map((category) => (
                      <AccordionItem
                        key={category.name}
                        value={category.name}
                        className="overflow-hidden border-none"
                      >
                        {category.subcategories ? (
                          <>
                            <AccordionTrigger 
                              className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-zinc-50 data-[state=open]:bg-zinc-50 [&[data-state=open]>svg]:text-zinc-600"
                            >
                              <span className="text-zinc-500 transition-colors duration-200 group-hover:text-zinc-600">
                                {category.icon}
                              </span>
                              <span className="flex-1">{category.name}</span>
                            </AccordionTrigger>
                            
                            <AccordionContent className="pb-0.5 pt-0.5">
                              <div className="space-y-0.5 pl-3">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                                    onClick={onClose}
                                  >
                                    <div className="h-1 w-1 rounded-full bg-zinc-300 transition-colors duration-200" />
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </>
                        ) : (
                          <Link
                            href={category.href}
                            className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 active:bg-zinc-100"
                            onClick={onClose}
                          >
                            <span className="text-zinc-500 transition-colors duration-200 group-hover:text-zinc-600">
                              {category.icon}
                            </span>
                            <span className="flex-1">{category.name}</span>
                            <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollArea>

              {/* Quick Account Actions */}
              <div className="border-t border-zinc-200/80 bg-zinc-50/50 px-3 py-3">
                <div className="grid grid-cols-3 gap-2">
                  {defaultAccountOptions.filter(opt => opt.name !== "Logout").map((option) => (
                    <Link
                      key={option.name}
                      href={option.href}
                      className="group flex flex-col items-center gap-1.5 rounded-lg bg-white px-2 py-2.5 text-center ring-1 ring-zinc-100/80 transition-all duration-200 hover:bg-zinc-50 hover:ring-zinc-200 active:scale-[0.98]"
                      onClick={onClose}
                    >
                      <span className="text-zinc-500 transition-colors group-hover:text-zinc-900">{option.icon}</span>
                      <span className="text-[11px] font-medium text-zinc-600 group-hover:text-zinc-900">{option.name}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/auth/logout"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-600 backdrop-blur transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98]"
                  onClick={onClose}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
