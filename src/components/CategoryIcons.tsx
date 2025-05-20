'use client';

import { 
  ShirtIcon, 
  ShoesIcon, 
  HatIcon, 
  WatchIcon,
  GlassesIcon,
  AllIcon,
  HoodieIcon,
  JacketIcon
} from './ui/category-icons';

export interface CategoryIcon {
  Shoes: React.ReactNode;
  Shirts: React.ReactNode;
  Hats: React.ReactNode;
  Accessories: React.ReactNode;
  Eyewear: React.ReactNode;
  All: React.ReactNode;
  Hoodies: React.ReactNode;
  Jackets: React.ReactNode;
}

export const categoryIcons: CategoryIcon = {
  Shoes: <ShoesIcon className="h-7 w-7" />,
  Shirts: <ShirtIcon className="h-7 w-7" />,
  Hats: <HatIcon className="h-7 w-7" />,
  Accessories: <WatchIcon className="h-7 w-7" />,
  Eyewear: <GlassesIcon className="h-7 w-7" />,
  All: <AllIcon className="h-7 w-7" />,
  Hoodies: <HoodieIcon className="h-7 w-7" />,
  Jackets: <JacketIcon className="h-7 w-7" />
}; 