import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-base text-white shadow-sm hover:bg-primary-dark active:bg-primary-dark/90",
        secondary:
          "bg-white border border-primary-base text-primary-base shadow-sm hover:bg-gray-50 active:bg-gray-100",
        outline:
          "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100",
        ghost: 
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        destructive:
          "bg-error text-white shadow-sm hover:bg-error/90 active:bg-error/80",
        link: 
          "text-primary-base underline-offset-4 hover:underline",
        text:
          "bg-transparent text-primary-base hover:bg-gray-50 active:bg-gray-100",
      },
      size: {
        // Default size optimized for mobile touch (44px height)
        default: "h-11 px-4 py-2 md:h-10",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-6",
        xl: "h-14 rounded-lg px-8 text-base",
        // Icon button with mobile-friendly touch target
        icon: "h-11 w-11 md:h-10 md:w-10",
        // Icon only for small UI elements
        "icon-sm": "h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 