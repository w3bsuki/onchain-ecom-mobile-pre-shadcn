'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ScrollBar } from './scroll-area';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterScrollAreaProps {
  options: FilterOption[];
  activeOption: string;
  onOptionChange: (optionId: string) => void;
  label?: string;
}

export default function FilterScrollArea({
  options,
  activeOption,
  onOptionChange,
  label
}: FilterScrollAreaProps) {
  return (
    <div className="w-full mb-5">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">{label}</h3>
        </div>
      )}
      
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex py-1">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onOptionChange(option.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm mx-1 transition-colors",
                "first:ml-2 last:mr-2",
                activeOption === option.id
                  ? "bg-black border-black text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              {option.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
} 