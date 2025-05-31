import React from 'react';
import { FiPlus, FiTrendingUp, FiPercent } from 'react-icons/fi';
import type { QuickFilter } from '@/types';

// Default quick filters
export const DEFAULT_QUICK_FILTERS: QuickFilter[] = [
  { id: 'new', name: 'NEW ARRIVALS', icon: React.createElement(FiPlus, { size: 14 }) },
  { id: 'trending', name: 'TRENDING', icon: React.createElement(FiTrendingUp, { size: 14 }) },
  { id: 'sale', name: 'SALE', icon: React.createElement(FiPercent, { size: 14 }) },
]; 