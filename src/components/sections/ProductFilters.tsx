import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw } from 'lucide-react';
import type { FilterOption, ColorOption } from '@/types';
import { DEFAULT_MAX_PRICE } from '@/data/filters';

interface ProductFiltersProps {
  filterOptions: FilterOption[];
  sizes: string[];
  colors: ColorOption[];
  maxPrice?: number;
  // Current state
  activeFilter: string;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: { min: number; max: number };
  // Actions
  onFilterChange: (filter: string) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onApplyFilters: () => void;
  onClearAll: () => void;
}

export const ProductFilters = ({
  filterOptions,
  sizes,
  colors,
  maxPrice = DEFAULT_MAX_PRICE,
  // Current state
  activeFilter,
  selectedSizes,
  selectedColors,
  priceRange,
  // Actions
  onFilterChange,
  onSizeToggle,
  onColorToggle,
  onPriceRangeChange,
  onApplyFilters,
  onClearAll
}: ProductFiltersProps) => {
  // Local state for slider to avoid too many updates
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setLocalPriceRange({
      min: value[0],
      max: value[1] || maxPrice
    });
  };

  // Apply local price range to parent state
  const handleSliderCommit = () => {
    onPriceRangeChange(localPriceRange);
  };

  return (
    <div className="py-4">
      {/* Sort options */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Sort By</h4>
        <div className="space-y-2">
          {filterOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`text-sm w-full text-left py-1.5 px-2 rounded flex items-center justify-between ${
                activeFilter === option.id ? 'bg-zinc-100 font-medium' : ''
              }`}
              onClick={() => onFilterChange(option.id)}
            >
              {option.name}
              {activeFilter === option.id && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion filters */}
      <Accordion type="multiple" defaultValue={['sizes', 'price']} className="w-full">
        {/* Size filter */}
        {sizes.length > 0 && (
          <AccordionItem value="sizes">
            <AccordionTrigger className="text-sm">Size</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => onSizeToggle(size)}
                    className={`text-sm border rounded py-1.5 ${
                      selectedSizes.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Color filter */}
        {colors.length > 0 && (
          <AccordionItem value="colors">
            <AccordionTrigger className="text-sm">Color</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-3 pt-2">
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color.id}
                    onClick={() => onColorToggle(color.id)}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div 
                      className={`w-6 h-6 rounded-full border ${
                        selectedColors.includes(color.id) 
                          ? 'ring-2 ring-black ring-offset-1' 
                          : 'ring-1 ring-zinc-200 hover:ring-zinc-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price range filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 px-2">
              <Slider
                defaultValue={[priceRange.min, priceRange.max]}
                value={[localPriceRange.min, localPriceRange.max]}
                max={maxPrice}
                step={5}
                onValueChange={handleSliderChange}
                onValueCommit={handleSliderCommit}
              />
              <div className="flex items-center justify-between mt-4 text-sm">
                <span>${localPriceRange.min}</span>
                <span>${localPriceRange.max}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action buttons */}
      <div className="flex gap-2 mt-8">
        <Button
          onClick={onClearAll}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Clear All
        </Button>
        <Button 
          onClick={onApplyFilters}
          className="flex-1" 
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}; 