import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "../../utils/cn"


const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "wa-z-50 wa-w-72 wa-rounded-md wa-border wa-bg-popover wa-p-4 wa-text-popover-foreground wa-shadow-md wa-outline-none wa-data-[state=open]:animate-in wa-data-[state=closed]:animate-out wa-data-[state=closed]:fade-out-0 wa-data-[state=open]:fade-in-0 wa-data-[state=closed]:zoom-out-95 wa-data-[state=open]:zoom-in-95 wa-data-[side=bottom]:slide-in-from-top-2 wa-data-[side=left]:slide-in-from-right-2 wa-data-[side=right]:slide-in-from-left-2 wa-data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
