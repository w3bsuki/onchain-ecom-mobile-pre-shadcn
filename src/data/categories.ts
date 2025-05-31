import React from 'react';
import { FaShirt, FaLayerGroup, FaBagShopping } from 'react-icons/fa6';
import type { CategoryCard } from '@/types';

// Pre-defined category cards data
export const categoryCards: CategoryCard[] = [
  { id: 'tshirts', name: 'T-Shirts', icon: React.createElement(FaShirt, { size: 18 }), count: 128 },
  { id: 'shirts', name: 'Shirts', icon: React.createElement(FaShirt, { size: 18 }), count: 96 },
  { id: 'shorts', name: 'Shorts', icon: React.createElement(FaLayerGroup, { size: 18 }), count: 64 },
  { id: 'shoes', name: 'Shoes', icon: React.createElement(FaBagShopping, { size: 18 }), count: 78 },
  { id: 'denim', name: 'Denim', icon: React.createElement(FaLayerGroup, { size: 18 }), count: 53 },
  { id: 'jackets', name: 'Jackets', icon: React.createElement(FaBagShopping, { size: 18 }), count: 42 },
]; 