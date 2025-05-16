import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import BottomSheet from './bottom-sheet';

interface FilterOption {
  id: string;
  name: string;
}

interface MobileFiltersProps {
  options: FilterOption[];
  activeOption: string;
  onOptionChange: (optionId: string) => void;
}

export default function MobileFilters({
  options,
  activeOption,
  onOptionChange,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    onOptionChange(optionId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 items-center justify-center p-2 rounded-full bg-gray-100 text-gray-700 w-10"
        aria-label="Open filters"
        type="button"
      >
        <SlidersHorizontal size={18} />
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filter & Sort"
      >
        <div className="divide-gray-100 divide-y">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`block py-4 text-left w-full ${
                activeOption === option.id
                  ? 'font-medium text-black'
                  : 'text-gray-600'
              }`}
              type="button"
            >
              {option.name}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
} 