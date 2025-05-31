import type { FC } from 'react';
import type { QuickFilter } from '@/types';

interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilter: string | null;
  onFilterClick: (filterId: string) => void;
}

export const QuickFilters = ({
  filters,
  activeFilter,
  onFilterClick
}: QuickFiltersProps) => {
  return (
    <div className="scrollbar-hide flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
      {filters.map((filter) => (
        <button
          type="button"
          key={filter.id}
          onClick={() => onFilterClick(filter.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium whitespace-nowrap ${
            activeFilter === filter.id
              ? 'bg-black text-white'
              : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
          } transition-colors`}
        >
          <span className="flex-shrink-0">{filter.icon}</span>
          {filter.name}
        </button>
      ))}
    </div>
  );
}; 