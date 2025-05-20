'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Slider } from "../../../components/ui/slider";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  name: string;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterScrollAreaProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  filters: FilterOption[];
  selectedSizes?: string[];
  onSizeChange?: (size: string) => void;
  priceRange?: PriceRange;
  onPriceRangeChange?: (range: PriceRange) => void;
  selectedColors?: string[];
  onColorChange?: (color: string) => void;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "gray", name: "Gray", hex: "#808080" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "red", name: "Red", hex: "#FF0000" },
  { id: "green", name: "Green", hex: "#008000" },
  { id: "yellow", name: "Yellow", hex: "#FFFF00" },
  { id: "purple", name: "Purple", hex: "#800080" },
  { id: "pink", name: "Pink", hex: "#FFC0CB" },
  { id: "orange", name: "Orange", hex: "#FFA500" },
];

const brands = ["Nike", "Adidas", "Puma", "Under Armour", "New Balance"];
const materials = ["Cotton", "Polyester", "Leather", "Denim", "Wool"];

export default function FilterScrollArea({ 
  activeFilter, 
  onFilterChange,
  filters = [],
  selectedSizes = [],
  onSizeChange = () => {},
  priceRange = { min: 0, max: 500 },
  onPriceRangeChange = () => {},
  selectedColors = [],
  onColorChange = () => {}
}: FilterScrollAreaProps) {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="font-medium mb-4 text-base text-gray-900">Sort By</h3>
        <div className="flex flex-col gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "border border-black flex h-10 items-center justify-start px-4 py-2 rounded text-sm transition-all",
                activeFilter === filter.id 
                  ? "bg-black font-medium text-white" 
                  : "bg-white font-normal hover:bg-gray-50 text-gray-900"
              )}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-200 h-px w-full" />

      <Accordion type="multiple" defaultValue={["sizes", "price", "colors", "brands", "materials"]} className="w-full">
        <AccordionItem value="sizes" className="border-none">
          <AccordionTrigger className="font-medium hover:no-underline py-3 text-base text-gray-900">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="gap-2 grid grid-cols-3 pt-1">
              {sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={cn(
                    "border border-black cursor-pointer flex font-medium h-10 items-center justify-center rounded text-sm transition-colors w-full",
                    selectedSizes.includes(size)
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-50 text-gray-900"
                  )}
                  onClick={() => onSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="font-medium hover:no-underline py-3 text-base text-gray-900">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 space-y-4">
              <Slider
                defaultValue={[priceRange.min, priceRange.max]}
                max={500}
                step={10}
                className="w-full"
                onValueChange={(value) => onPriceRangeChange({ min: value[0], max: value[1] })}
              />
              <div className="flex items-center justify-between">
                <div className="border border-black px-3 py-1.5 rounded-md">
                  <span className="text-gray-900 text-sm">${priceRange.min}</span>
                </div>
                <div className="border border-black px-3 py-1.5 rounded-md">
                  <span className="text-gray-900 text-sm">${priceRange.max}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors" className="border-none">
          <AccordionTrigger className="font-medium hover:no-underline py-3 text-base text-gray-900">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3 pt-2">
              {colors.map((color) => (
                <div 
                  key={color.id}
                  className="flex flex-col items-center mb-2"
                >
                  <button
                    type="button"
                    className={cn(
                      "border-2 cursor-pointer flex h-8 items-center justify-center rounded-full transition-all w-8",
                      selectedColors.includes(color.id)
                        ? "border-black scale-110"
                        : "border-gray-300 hover:border-black"
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => onColorChange(color.id)}
                    aria-label={`Select ${color.name} color`}
                  />
                  <span className="font-medium mt-1 text-gray-900 text-xs">{color.name}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="brands" className="border-none">
          <AccordionTrigger className="font-medium hover:no-underline py-3 text-base text-gray-900">
            Brand
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pt-1">
              {brands.map((brand) => (
                <button
                  type="button"
                  key={brand}
                  className="border border-black flex font-normal h-10 hover:bg-gray-50 items-center justify-between px-4 py-2 rounded text-gray-900 text-sm transition-all"
                  onClick={() => {}}
                >
                  {brand}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="materials" className="border-none">
          <AccordionTrigger className="font-medium hover:no-underline py-3 text-base text-gray-900">
            Material
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pt-1">
              {materials.map((material) => (
                <button
                  type="button"
                  key={material}
                  className="border border-black flex font-normal h-10 hover:bg-gray-50 items-center justify-between px-4 py-2 rounded text-gray-900 text-sm transition-all"
                  onClick={() => {}}
                >
                  {material}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 