import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-body font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 dark:text-dark-500 shadow-lg hover:shadow-xl",
        secondary: "bg-gold-500 text-dark-500 hover:bg-gold-600 dark:bg-gold-400 dark:hover:bg-gold-300 shadow-lg",
        outline: "border-2 border-primary-500 bg-transparent text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/20",
        ghost: "hover:bg-cream-200 text-primary-600 dark:text-primary-400 dark:hover:bg-dark-50",
        gold: "bg-gold-500 text-dark-500 hover:bg-gold-600 dark:bg-gold-400 dark:hover:bg-gold-300 shadow-lg",
        forest: "bg-forest-500 text-white hover:bg-forest-600 dark:bg-forest-400 dark:hover:bg-forest-300 dark:text-dark-500 shadow-lg",
        warm: "bg-warm-500 text-white hover:bg-warm-600 dark:bg-warm-400 dark:hover:bg-warm-300 shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
