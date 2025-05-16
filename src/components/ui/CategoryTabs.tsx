'use client';

import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from './scroll-area';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tabsContainer = tabsRef.current;
      const activeTab = activeTabRef.current;
      
      const tabsRect = tabsContainer.getBoundingClientRect();
      const activeTabRect = activeTab.getBoundingClientRect();
      
      // Calculate position to center the active tab
      const scrollPosition = activeTabRect.left - tabsRect.left - (tabsRect.width / 2) + (activeTabRect.width / 2);
      
      tabsContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  return (
    <div className="w-full mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex py-3">
          {categories.map((category) => (
            <button
              key={category.id}
              ref={category.id === activeCategory ? activeTabRef : null}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex flex-col items-center justify-center px-6 py-3 min-w-[100px] rounded-lg transition-colors mx-1.5",
                "border shadow-sm first:ml-2 last:mr-2",
                activeCategory === category.id 
                  ? "bg-black text-white border-black shadow-md" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {category.icon && (
                <div className="mb-2">{category.icon}</div>
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
} 