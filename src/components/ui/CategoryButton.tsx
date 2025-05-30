'use client';

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const categoryButtonVariants = cva(
  "border flex flex-col items-center justify-center relative transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white border-zinc-100 hover:border-zinc-200 text-zinc-900 hover:shadow-sm",
        active: "bg-gradient-to-b from-zinc-900 to-black border-zinc-800 shadow-md text-white",
      },
      size: {
        sm: "gap-2 min-w-[75px] p-2 rounded-lg",
        md: "gap-2.5 min-w-[100px] p-3 rounded-xl",
        lg: "gap-3 min-w-[120px] p-4 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface CategoryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof categoryButtonVariants> {
  icon: React.ReactNode;
  name: string;
  count?: number;
  isActive?: boolean;
}

/**
 * A refined category button component with elegant typography and styling
 */
const CategoryButton = forwardRef<HTMLButtonElement, CategoryButtonProps>(
  ({ 
    className, 
    icon, 
    name, 
    count, 
    isActive = false, 
    variant = isActive ? "active" : "default", 
    size = "md", 
    ...props 
  }, ref) => {
    // Size variants for internal elements
    const iconContainerClasses = {
      sm: "h-9 w-9",
      md: "h-11 w-11",
      lg: "h-14 w-14",
    };
    
    const textClasses = {
      sm: "text-xs tracking-wide",
      md: "text-sm tracking-wide",
      lg: "text-base tracking-wide",
    };
    
    const countClasses = {
      sm: "px-1.5 py-0.5 text-[10px]",
      md: "px-2 py-0.5 text-xs",
      lg: "px-2.5 py-0.5 text-sm",
    };

    return (
      <button
        type="button"
        ref={ref}
        className={cn(categoryButtonVariants({ variant, size, className }))}
        {...props}
      >
        <div className={cn(
          "flex items-center justify-center overflow-hidden relative rounded-full transition-colors",
          iconContainerClasses[size],
          isActive 
            ? "bg-zinc-800 text-white" 
            : "bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-700"
        )}>
          {/* Light effect for active state */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-80" />
          )}
          <div className="relative">
            {icon}
          </div>
        </div>
        
        <span className={cn(
          "font-medium text-center truncate w-full",
          textClasses[size],
          isActive ? "text-white" : "text-zinc-800"
        )}>
          {name}
        </span>
        
        {count !== undefined && (
          <span className={cn(
            "rounded-full transition-colors font-medium",
            countClasses[size],
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-zinc-100 text-zinc-600"
          )}>
            {count}
          </span>
        )}
        
        {/* Enhanced focus states */}
        <span className="absolute inset-0 opacity-0 ring-offset-2 ring-black ring-offset-white transition-opacity focus-visible:opacity-100 focus-visible:ring-2 rounded-xl" />
      </button>
    );
  }
);
CategoryButton.displayName = "CategoryButton";

export { CategoryButton, categoryButtonVariants };
