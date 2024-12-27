import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../utils/cn"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "wa-relative wa-flex wa-w-full wa-touch-none wa-select-none wa-items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="wa-relative wa-h-1.5 wa-w-full wa-grow wa-overflow-hidden wa-rounded-full wa-bg-primary/20">
      <SliderPrimitive.Range className="wa-absolute wa-h-full wa-bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="wa-block wa-h-4 wa-w-4 wa-rounded-full wa-border wa-border-primary/50 wa-bg-background wa-shadow wa-transition-colors wa-focus-visible:outline-none wa-focus-visible:ring-1 wa-focus-visible:ring-ring wa-disabled:pointer-events-none wa-disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
