'use client';

import { useState, useEffect, ButtonHTMLAttributes, ReactNode } from 'react';
import { Check, Filter as FilterIcon, RotateCcw } from 'lucide-react';
import BottomSheet from '@/components/ui/bottom-sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

// Define monochrome styling for quick filter buttons with our black/grey/white theme
const QUICK_FILTER_STYLES = {
  new: { 
    bg: 'bg-black', 
    hover: 'hover:bg-zinc-800', 
    text: 'text-zinc-800',
    activeBorder: 'border-black',
    inactiveBorder: 'border-zinc-200' 
  },
  hot: { 
    bg: 'bg-black', 
    hover: 'hover:bg-zinc-800', 
    text: 'text-zinc-800',
    activeBorder: 'border-black',
    inactiveBorder: 'border-zinc-200'  
  },
  sale: { 
    bg: 'bg-black', 
    hover: 'hover:bg-zinc-800', 
    text: 'text-zinc-800',
    activeBorder: 'border-black',
    inactiveBorder: 'border-zinc-200'  
  }
} as const;

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
  filters: FilterOption[];
  activeFilter: string;
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

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "gray", name: "Gray", hex: "#808080" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "red", name: "Red", hex: "#FF0000" }
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
  filters = [],
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
  const [tempActiveFilter, setTempActiveFilter] = useState(activeFilter);
  const [tempSelectedSizes, setTempSelectedSizes] = useState(selectedSizes);
  const [tempSelectedColors, setTempSelectedColors] = useState(selectedColors);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSelectedBrands, setTempSelectedBrands] = useState(selectedBrands);
  const [tempSelectedMaterials, setTempSelectedMaterials] = useState(selectedMaterials);

  // Sync temporary states when props change
  useEffect(() => setTempActiveFilter(activeFilter), [activeFilter]);
  useEffect(() => setTempSelectedSizes(selectedSizes), [selectedSizes]);
  useEffect(() => setTempSelectedColors(selectedColors), [selectedColors]);
  useEffect(() => setTempPriceRange(priceRange), [priceRange]);
  useEffect(() => setTempSelectedBrands(selectedBrands), [selectedBrands]);
  useEffect(() => setTempSelectedMaterials(selectedMaterials), [selectedMaterials]);
  const handleApplyFilters = () => {
    onFilterChange(tempActiveFilter);
    
    // Apply size changes
    tempSelectedSizes.forEach(size => {
      if (!selectedSizes.includes(size)) onSizeChange(size);
    });
    selectedSizes.forEach(size => {
      if (!tempSelectedSizes.includes(size)) onSizeChange(size);
    });
    
    // Apply color changes
    tempSelectedColors.forEach(color => {
      if (!selectedColors.includes(color)) onColorChange(color);
    });
    selectedColors.forEach(color => {
      if (!tempSelectedColors.includes(color)) onColorChange(color);
    });
    
    // Apply brand changes
    tempSelectedBrands.forEach(brand => {
      if (!selectedBrands.includes(brand)) onBrandChange(brand);
    });
    selectedBrands.forEach(brand => {
      if (!tempSelectedBrands.includes(brand)) onBrandChange(brand);
    });
    
    // Apply material changes
    tempSelectedMaterials.forEach(material => {
      if (!selectedMaterials.includes(material)) onMaterialChange(material);
    });
    selectedMaterials.forEach(material => {
      if (!tempSelectedMaterials.includes(material)) onMaterialChange(material);
    });
    
    onPriceRangeChange(tempPriceRange);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setTempActiveFilter(filters[0]?.id || '');
    setTempSelectedSizes([]);
    setTempSelectedColors([]);
    setTempPriceRange({ min: 0, max: maxPrice });
    setTempSelectedBrands([]);
    setTempSelectedMaterials([]);
  };

  const resetSheetStates = () => {
    setTempActiveFilter(activeFilter);
    setTempSelectedSizes(selectedSizes);
    setTempSelectedColors(selectedColors);
    setTempPriceRange(priceRange);
    setTempSelectedBrands(selectedBrands);
    setTempSelectedMaterials(selectedMaterials);
  };

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
      <div className="mb-4 flex space-x-3">
        {quickFilters.map((qf) => (
          <Button
            key={qf.id}
            variant={activeQuickFilter === qf.id ? 'default' : 'outline'}
            className={cn(
              "relative flex-1 px-4 py-3 transition-all duration-200",
              // Perfect typography - crisp, minimal and elegant
              "font-medium tracking-[0.12em] uppercase text-xs",
              // Enhanced UI with subtle interactions
              "hover:transform hover:shadow-md focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1",
              activeQuickFilter === qf.id
                ? cn(
                    // Active state - sleek black styling with white text
                    "bg-black text-white border-black",
                    "shadow-sm hover:bg-zinc-800"
                  )
                : cn(
                    // Inactive state - crisp white with black/gray accents
                    "bg-white border border-zinc-200",
                    "text-zinc-800 hover:border-zinc-300",
                    "after:absolute after:inset-0 after:opacity-0 hover:after:opacity-5 after:bg-black after:transition-opacity"
                  )
            )}
            onClick={() => onQuickFilterChange(activeQuickFilter === qf.id ? null : qf.id)}
          >
            {qf.name}
            {/* Indicator dot with improved positioning and styling */}
            {activeQuickFilter !== qf.id && (
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-black" />
            )}
          </Button>
        ))}
      </div>
      
      <Button
        onClick={() => {
          resetSheetStates();
          setIsOpen(true);
        }}
        variant="outline"
        className="flex w-full items-center justify-between rounded-xl border-zinc-200 px-4 py-3 font-medium text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
      >
        <div className="flex items-center">
          <FilterIcon className="mr-2 h-5 w-5 text-zinc-600" />
          <span>Filters</span>
        </div>
        {activeFiltersCount > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-1.5 text-sm font-medium text-white">
            {activeFiltersCount}
          </span>
        )}
      </Button>
      
      <BottomSheet 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Product Filters"
        snapPoints={[0.9]}
      >
        <div className="h-full overflow-y-auto overscroll-none pb-24 touch-pan-y">
          <Accordion 
            type="multiple" 
            defaultValue={["sort", "size"]} 
            className="w-full [&>*]:border-b [&>*]:border-zinc-200"
          >
            {/* Sort By Section */}
            <AccordionItem value="sort" className="overflow-hidden">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                Sort By 
                {tempActiveFilter && filters.find(f=>f.id === tempActiveFilter) && (
                  <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>
                    {filters.find(f=>f.id === tempActiveFilter)?.name}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="space-y-1.5">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={tempActiveFilter === filter.id ? "default" : "ghost"}
                      onClick={() => setTempActiveFilter(filter.id)}
                      className={cn(
                        "flex h-auto w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm transition-colors active:bg-zinc-100",
                        tempActiveFilter === filter.id 
                          ? "bg-black text-white shadow-sm hover:bg-zinc-800" 
                          : "text-zinc-700 hover:bg-zinc-50"
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
            <AccordionItem value="size" className="overflow-hidden">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                Size
                {tempSelectedSizes.length > 0 && (
                  <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>
                    {tempSelectedSizes.length} selected
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="flex flex-wrap gap-2 px-2">
                  {allSizes.map((size) => (
                    <div
                      key={size}
                      onClick={() => {
                        setTempSelectedSizes(prev => {
                          const newSizes = prev.includes(size) 
                            ? prev.filter(s => s !== size)
                            : [...prev, size];
                          return newSizes;
                        });
                      }}
                      className={cn(
                        "flex h-9 min-w-[48px] cursor-pointer select-none items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                        tempSelectedSizes.includes(size)
                          ? "border-black bg-black text-white hover:bg-zinc-800 hover:border-zinc-800" 
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Colors Section */}
            <AccordionItem value="colors" className="overflow-hidden">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                Colors
                {tempSelectedColors.length > 0 && (
                  <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>
                    {tempSelectedColors.length} selected
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="flex flex-wrap gap-2 px-2">
                  {allColors.map((color) => (                      <Button
                      key={color.id}
                      variant="outline"
                      onClick={() => {
                        setTempSelectedColors(prev => 
                          prev.includes(color.id) 
                            ? prev.filter(c => c !== color.id)
                            : [...prev, color.id]
                        );
                      }}
                      className={cn(
                        "flex h-9 min-w-[48px] items-center gap-1 rounded-lg border px-2 text-xs font-medium transition-colors",
                        tempSelectedColors.includes(color.id)
                          ? "border-black bg-white text-black hover:bg-zinc-50" 
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >                        <span 
                        className={cn(
                          "h-3.5 w-3.5 rounded-full border border-zinc-200",
                          color.id === 'black' && "bg-black",
                          color.id === 'white' && "bg-white",
                          color.id === 'gray' && "bg-gray-500",
                          color.id === 'blue' && "bg-blue-600",
                          color.id === 'red' && "bg-red-600"
                        )} 
                        aria-label={`${color.name} color`}
                      />
                      {color.name}
                      {tempSelectedColors.includes(color.id) && <Check className="ml-auto h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Price Range Section */}
            <AccordionItem value="price" className="overflow-hidden">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                Price Range
                {(tempPriceRange.min > 0 || tempPriceRange.max < maxPrice) && (
                  <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>
                    ${tempPriceRange.min} - ${tempPriceRange.max}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-5 pt-2">
                <div className="space-y-5">
                  <Slider 
                    defaultValue={[tempPriceRange.min, tempPriceRange.max]}
                    min={0}
                    max={maxPrice}
                    step={10}
                    onValueChange={(value) => {
                      setTempPriceRange({ min: value[0], max: value[1] });
                    }}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-20 items-center rounded-md border border-zinc-200 px-2">
                      <span className="text-xs text-zinc-400">$</span>                        <input
                        type="number"
                        min={0}
                        max={tempPriceRange.max}
                        value={tempPriceRange.min}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= tempPriceRange.max) {
                            setTempPriceRange(prev => ({ ...prev, min: value }));
                          }
                        }}
                        className="w-full border-0 bg-transparent p-0 text-right text-sm focus:outline-none focus:ring-0"
                        aria-label="Minimum price"
                        title="Minimum price"
                      />
                    </div>
                    <div className="text-xs text-zinc-400">to</div>
                    <div className="flex h-9 w-20 items-center rounded-md border border-zinc-200 px-2">                        <span className="text-xs text-zinc-400">$</span>
                      <input
                        type="number"
                        min={tempPriceRange.min}
                        max={maxPrice}
                        value={tempPriceRange.max}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= tempPriceRange.min && value <= maxPrice) {
                            setTempPriceRange(prev => ({ ...prev, max: value }));
                          }
                        }}
                        className="w-full border-0 bg-transparent p-0 text-right text-sm focus:outline-none focus:ring-0"
                        aria-label="Maximum price"
                        title="Maximum price"
                      />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Brands Section */}
            <AccordionItem value="brands" className="overflow-hidden">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                Brands
                {tempSelectedBrands.length > 0 && (
                  <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>
                    {tempSelectedBrands.length} selected
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="space-y-1.5">
                  {allBrands.map((brand) => (
                    <Button
                      key={brand}
                      variant="ghost"
                      onClick={() => {
                        setTempSelectedBrands(prev => 
                          prev.includes(brand) 
                            ? prev.filter(b => b !== brand)
                            : [...prev, brand]
                        );
                      }}
                      className={cn(
                        "flex h-auto w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm",
                        tempSelectedBrands.includes(brand)
                          ? "bg-zinc-100 text-black font-medium" 
                          : "text-zinc-700"
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
            <AccordionItem value="materials" className="overflow-hidden">
              <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                Materials
                {tempSelectedMaterials.length > 0 && (
                  <span className='ml-auto mr-2 text-xs font-normal text-gray-500'>
                    {tempSelectedMaterials.length} selected
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-3 pt-1">
                <div className="space-y-1.5">
                  {allMaterials.map((material) => (
                    <Button
                      key={material}
                      variant="ghost"
                      onClick={() => {
                        setTempSelectedMaterials(prev => 
                          prev.includes(material) 
                            ? prev.filter(m => m !== material)
                            : [...prev, material]
                        );
                      }}
                      className={cn(
                        "flex h-auto w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm",
                        tempSelectedMaterials.includes(material)
                          ? "bg-zinc-100 text-black font-medium" 
                          : "text-zinc-700"
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
          
          <div className="fixed inset-x-0 bottom-0 z-10 flex gap-3 border-t border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="flex-1 rounded-xl border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-100 active:bg-gray-200"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Clear All
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="flex-1 rounded-xl bg-primary-base text-sm font-medium text-white shadow-sm hover:bg-primary-dark active:bg-primary-darker"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}