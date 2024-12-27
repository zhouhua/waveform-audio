import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"
const buttonVariants = cva(
  "wa-inline-flex wa-items-center wa-justify-center wa-gap-2 wa-whitespace-nowrap wa-rounded-md wa-text-sm wa-font-medium wa-transition-colors wa-focus-visible:outline-none wa-focus-visible:ring-1 wa-focus-visible:ring-ring wa-disabled:pointer-events-none wa-disabled:opacity-50 wa-[&_svg]:pointer-events-none wa-[&_svg]:size-4 wa-[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "wa-bg-primary wa-text-primary-foreground wa-shadow wa-hover:wa-bg-primary/90",
        destructive:
          "wa-bg-destructive wa-text-destructive-foreground wa-shadow-sm wa-hover:wa-bg-destructive/90",
        outline:
          "wa-border wa-border-input wa-bg-background wa-shadow-sm wa-hover:wa-bg-accent wa-hover:wa-text-accent-foreground",
        secondary:
          "wa-bg-secondary wa-text-secondary-foreground wa-shadow-sm wa-hover:wa-bg-secondary/80",
        ghost: "wa-hover:wa-bg-accent wa-hover:wa-text-accent-foreground",
        link: "wa-text-primary wa-underline-offset-4 wa-hover:wa-underline",
      },
      size: {
        default: "wa-h-9 wa-px-4 wa-py-2",
        sm: "wa-h-8 wa-rounded-md wa-px-3 wa-text-xs",
        lg: "wa-h-10 wa-rounded-md wa-px-8",
        icon: "wa-h-9 wa-w-9",
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
