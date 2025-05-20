'use client';

import { useState, useEffect } from 'react';
import { Check, Filter as FilterIcon, RotateCcw } from 'lucide-react';
import BottomSheet from './bottom-sheet'; // Assuming this is a reusable component
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface FilterOption {
  id: string;
  name: string;
}

interface QuickFilterOption {
  id: string;
  name: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface MobileFiltersProps {
  filters: FilterOption[]; // For sort by
  activeFilter: string; // For sort by
  onFilterChange: (filterId: string) => void;
  
  selectedSizes?: string[];
  onSizeChange?: (size: string) => void;
  allSizes?: string[];

  selectedColors?: string[];
  onColorChange?: (colorId: string) => void;
  allColors?: { id: string; name: string; hex: string }[];

  priceRange?: PriceRange;
  onPriceRangeChange?: (range: PriceRange) => void;
  maxPrice?: number;

  selectedBrands?: string[];
  onBrandChange?: (brand: string) => void;
  allBrands?: string[];

  selectedMaterials?: string[];
  onMaterialChange?: (material: string) => void;
  allMaterials?: string[];

  quickFilters?: QuickFilterOption[];
  activeQuickFilter?: string | null;
  onQuickFilterChange?: (filterId: string | null) => void;
}

// Default values, can be overridden by props if needed
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "gray", name: "Gray", hex: "#808080" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "red", name: "Red", hex: "#FF0000" },
  // Add more colors as needed
];
const DEFAULT_BRANDS = ["Nike", "Adidas", "Puma", "Reebok", "Asics"];
const DEFAULT_MATERIALS = ["Cotton", "Polyester", "Leather", "Denim", "Wool"];
const DEFAULT_MAX_PRICE = 500;
const DEFAULT_QUICK_FILTERS: QuickFilterOption[] = [
  { id: 'new', name: 'NEW' },
  { id: 'hot', name: 'HOT' },
  { id: 'sale', name: 'SALE' },
];

export default function MobileFilters({
  filters = [], // Sort by options
  activeFilter,
  onFilterChange,
  selectedSizes = [],
  onSizeChange = () => {},
  allSizes = DEFAULT_SIZES,
  selectedColors = [],
  onColorChange = () => {},
  allColors = DEFAULT_COLORS,
  priceRange = { min: 0, max: DEFAULT_MAX_PRICE },
  onPriceRangeChange = () => {},
  maxPrice = DEFAULT_MAX_PRICE,
  selectedBrands = [],
  onBrandChange = () => {},
  allBrands = DEFAULT_BRANDS,
  selectedMaterials = [],
  onMaterialChange = () => {},
  allMaterials = DEFAULT_MATERIALS,
  quickFilters = DEFAULT_QUICK_FILTERS,
  activeQuickFilter = null,
  onQuickFilterChange = () => {},
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Temporary states for changes within the bottom sheet
  const [tempActiveFilter, setTempActiveFilter] = useState(activeFilter);
  const [tempSelectedSizes, setTempSelectedSizes] = useState(selectedSizes);
  const [tempSelectedColors, setTempSelectedColors] = useState(selectedColors);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSelectedBrands, setTempSelectedBrands] = useState(selectedBrands);
  const [tempSelectedMaterials, setTempSelectedMaterials] = useState(selectedMaterials);

  // Sync temporary states when props change (e.g., external clear)
  useEffect(() => setTempActiveFilter(activeFilter), [activeFilter]);
  useEffect(() => setTempSelectedSizes(selectedSizes), [selectedSizes]);
  useEffect(() => setTempSelectedColors(selectedColors), [selectedColors]);
  useEffect(() => setTempPriceRange(priceRange), [priceRange]);
  useEffect(() => setTempSelectedBrands(selectedBrands), [selectedBrands]);
  useEffect(() => setTempSelectedMaterials(selectedMaterials), [selectedMaterials]);

  const handleApplyFilters = () => {
    onFilterChange(tempActiveFilter);

    for (const size of tempSelectedSizes) {
      if(!selectedSizes.includes(size) || selectedSizes.length !== tempSelectedSizes.length) {
        onSizeChange(size); 
      }
    }
    for (const size of selectedSizes) {
      if(!tempSelectedSizes.includes(size)) {
        onSizeChange(size);
      }
    }

    for (const color of tempSelectedColors) {
      if(!selectedColors.includes(color) || selectedColors.length !== tempSelectedColors.length) {
        onColorChange(color);
      }
    }
    for (const color of selectedColors) {
      if(!tempSelectedColors.includes(color)) {
        onColorChange(color);
      }
    }
    
    for (const brand of tempSelectedBrands) {
      if(!selectedBrands.includes(brand) || selectedBrands.length !== tempSelectedBrands.length) {
        onBrandChange(brand);
      }
    }
    for (const brand of selectedBrands) {
      if(!tempSelectedBrands.includes(brand)) {
        onBrandChange(brand);
      }
    }

    for (const material of tempSelectedMaterials) {
      if(!selectedMaterials.includes(material) || selectedMaterials.length !== tempSelectedMaterials.length) {
        onMaterialChange(material);
      }
    }
    for (const material of selectedMaterials) {
      if(!tempSelectedMaterials.includes(material)) {
        onMaterialChange(material);
      }
    }

    onPriceRangeChange(tempPriceRange);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setTempActiveFilter(filters[0]?.id || ''); // Default to first sort option or empty
    setTempSelectedSizes([]);
    setTempSelectedColors([]);
    setTempPriceRange({ min: 0, max: maxPrice });
    setTempSelectedBrands([]);
    setTempSelectedMaterials([]);
    // Note: We don't call the main onchange handlers here, only on Apply
  };
  
  const resetSheetStates = () => {
    setTempActiveFilter(activeFilter);
    setTempSelectedSizes(selectedSizes);
    setTempSelectedColors(selectedColors);
    setTempPriceRange(priceRange);
    setTempSelectedBrands(selectedBrands);
    setTempSelectedMaterials(selectedMaterials);
  }

  const activeFiltersCount = (
    (activeQuickFilter ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedBrands.length +
    selectedMaterials.length +
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0)
  );

  return (
    <div className="w-full lg:hidden">
      <div className="mb-3 flex space-x-2">
        {quickFilters.map((qf) => (
          <Button
            key={qf.id}
            variant={activeQuickFilter === qf.id ? 'default' : 'outline'}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeQuickFilter === qf.id
                ? "bg-primary-base text-white shadow-sm hover:bg-primary-dark"
                : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            )}
            onClick={() => onQuickFilterChange(activeQuickFilter === qf.id ? null : qf.id)}
          >
            {qf.name}
          </Button>
        ))}
      </div>

      <Button
        onClick={() => {
            resetSheetStates(); // Ensure sheet opens with current applied filters
            setIsOpen(true);
        }}
        variant="outline"
        className="flex w-full items-center justify-between rounded-xl border-gray-300 px-4 py-3 font-medium text-gray-800 shadow-sm hover:border-gray-400 hover:bg-gray-50"
        size="default"
      >
        <div className="flex items-center">
          <FilterIcon className="mr-2 h-5 w-5 text-gray-600" />
          <span>Filters</span>
        </div>
        {activeFiltersCount > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-base px-1.5 text-sm font-medium text-white">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <BottomSheet 
        isOpen={isOpen} 
        onClose={() => {
            setIsOpen(false);
            // Optionally, reset temp states if user closes without applying:
            // resetSheetStates(); 
        }}
        title="Filter & Sort"
        snapPoints={[0.9, 0.6, 0.4]} // Example snap points, adjust as needed
        initialSnap={0} // Start at 90% height
      >
        <div className="p-1 pb-24"> {/* Padding for content and space for sticky footer */}
          <Accordion type="multiple" defaultValue={["sort", "size"]} className="w-full">
            {/* Sort By Section */}
            <AccordionItem value="sort">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline">
                Sort By 
                {tempActiveFilter && filters.find(f=>f.id === tempActiveFilter) && 
                    <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>{filters.find(f=>f.id === tempActiveFilter)?.name}</span>
                }
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="space-y-1.5">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      type="button"
                      variant={tempActiveFilter === filter.id ? "default" : "ghost"}
                      onClick={() => setTempActiveFilter(filter.id)}
                      className={cn(
                        "flex h-auto w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm",
                        tempActiveFilter === filter.id 
                          ? "bg-primary-base text-white shadow-sm hover:bg-primary-dark" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span>{filter.name}</span>
                      {tempActiveFilter === filter.id && <Check className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Size Section */}
            <AccordionItem value="size">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline">
                Size
                {tempSelectedSizes.length > 0 && 
                    <span className='ml-auto mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600'>{tempSelectedSizes.length} selected</span>
                }
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-3 pt-2">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {allSizes.map((size) => (
                    <Button
                      type="button"
                      key={size}
                      variant={tempSelectedSizes.includes(size) ? "default" : "outline"}
                      className={cn(
                        "h-11 rounded-md text-sm font-medium transition-all",
                        tempSelectedSizes.includes(size)
                          ? "border-primary-base bg-primary-base text-white shadow-sm hover:bg-primary-dark"
                          : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      )}
                      onClick={() => {
                        setTempSelectedSizes(prev => 
                          prev.includes(size) 
                            ? prev.filter(s => s !== size) 
                            : [...prev, size]
                        );
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Color Section */}
            <AccordionItem value="color">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline">
                Color
                {tempSelectedColors.length > 0 && 
                    <span className='ml-auto mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600'>{tempSelectedColors.length} selected</span>
                }
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-3 pt-3">
                <div className="flex flex-wrap gap-3">
                  {allColors.map((color) => (
                    <button
                      type="button"
                      key={color.id}
                      title={color.name}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-150 ease-in-out",
                        tempSelectedColors.includes(color.id)
                          ? 'scale-110 border-primary-base shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      )}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => {
                        setTempSelectedColors(prev => 
                          prev.includes(color.id) 
                            ? prev.filter(c => c !== color.id) 
                            : [...prev, color.id]
                        );
                      }}
                      aria-label={`Select ${color.name} color`}
                    >
                      {tempSelectedColors.includes(color.id) && (
                        <Check className={cn(color.id === 'white' || color.hex === '#FFFFFF' ? 'text-black' : 'text-white')} size={14} strokeWidth={3}/>
                      )}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Range Section */}
            <AccordionItem value="price">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline">
                Price Range
                {(tempPriceRange.min > 0 || tempPriceRange.max < maxPrice) &&
                    <span className='ml-auto mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600'>
                        ${tempPriceRange.min} - ${tempPriceRange.max}
                    </span>
                }
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-6">
                <Slider
                  defaultValue={[tempPriceRange.min, tempPriceRange.max]}
                  min={0}
                  max={maxPrice}
                  step={10}
                  minStepsBetweenThumbs={1}
                  className="mb-6 w-full"
                  onValueChange={(value) => setTempPriceRange({ min: value[0], max: value[1] })}
                  aria-label="Price range slider"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${tempPriceRange.min}</span>
                  <span>${tempPriceRange.max}</span>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Brands Section */}
             <AccordionItem value="brand">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline">
                Brand
                {tempSelectedBrands.length > 0 && 
                    <span className='ml-auto mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600'>{tempSelectedBrands.length} selected</span>
                }
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="space-y-1.5">
                  {allBrands.map((brand) => (
                    <Button
                      key={brand}
                      type="button"
                      variant={tempSelectedBrands.includes(brand) ? "default" : "ghost"}
                      onClick={() => {
                        setTempSelectedBrands(prev => 
                          prev.includes(brand) 
                            ? prev.filter(b => b !== brand) 
                            : [...prev, brand]
                        );
                      }}
                      className={cn(
                        "flex h-auto w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm",
                        tempSelectedBrands.includes(brand)
                          ? "bg-primary-base text-white shadow-sm hover:bg-primary-dark" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span>{brand}</span>
                      {tempSelectedBrands.includes(brand) && <Check className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Materials Section */}
            <AccordionItem value="material">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline">
                Material
                {tempSelectedMaterials.length > 0 && 
                    <span className='ml-auto mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600'>{tempSelectedMaterials.length} selected</span>
                }
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="space-y-1.5">
                  {allMaterials.map((material) => (
                    <Button
                      key={material}
                      type="button"
                      variant={tempSelectedMaterials.includes(material) ? "default" : "ghost"}
                      onClick={() => {
                        setTempSelectedMaterials(prev => 
                          prev.includes(material) 
                            ? prev.filter(m => m !== material) 
                            : [...prev, material]
                        );
                      }}
                      className={cn(
                        "flex h-auto w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm",
                        tempSelectedMaterials.includes(material)
                          ? "bg-primary-base text-white shadow-sm hover:bg-primary-dark" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <span>{material}</span>
                      {tempSelectedMaterials.includes(material) && <Check className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* Sticky Footer for actions */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex gap-3 border-t border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
          <Button 
            variant="outline" 
            onClick={handleClearAll}
            className="flex-1 rounded-xl border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-100"
            size="lg"
          >
            <RotateCcw size={14} className="mr-1.5" />
            Clear All
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="flex-1 rounded-xl bg-primary-base text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
            size="lg"
          >
            Apply Filters
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
} 