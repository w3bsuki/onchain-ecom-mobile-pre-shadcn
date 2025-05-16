'use client';

import { ScrollArea, ScrollBar } from "./scroll-area";
import { cn } from "@/lib/utils";

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
    <div className="mb-5 w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-gray-700 text-sm">{label}</h3>
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
                "border mx-1 px-4 py-1.5 rounded-full text-sm transition-colors",
                "first:ml-2 last:mr-2",
                activeOption === option.id
                  ? "bg-black border-black text-white"
                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
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