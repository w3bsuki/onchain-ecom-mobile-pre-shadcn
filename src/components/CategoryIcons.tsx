'use client';

import { 
  ShirtIcon, 
  ShoesIcon, 
  HatIcon, 
  WatchIcon,
  GlassesIcon,
  AllIcon
} from './ui/category-icons';

export interface CategoryIcon {
  Shoes: React.ReactNode;
  Shirts: React.ReactNode;
  Hats: React.ReactNode;
  Accessories: React.ReactNode;
  Eyewear: React.ReactNode;
  All: React.ReactNode;
}

export const categoryIcons: CategoryIcon = {
  Shoes: <ShoesIcon className="h-6 w-6" />,
  Shirts: <ShirtIcon className="h-6 w-6" />,
  Hats: <HatIcon className="h-6 w-6" />,
  Accessories: <WatchIcon className="h-6 w-6" />,
  Eyewear: <GlassesIcon className="h-6 w-6" />,
  All: <AllIcon className="h-6 w-6" />
}; 