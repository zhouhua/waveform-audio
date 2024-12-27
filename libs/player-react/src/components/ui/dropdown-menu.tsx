import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "../../utils/cn"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "wa-flex wa-cursor-default wa-gap-2 wa-select-none wa-items-center wa-rounded-sm wa-px-2 wa-py-1.5 wa-text-sm wa-outline-none wa-focus:bg-accent wa-data-[state=open]:bg-accent wa-[&_svg]:pointer-events-none wa-[&_svg]:size-4 wa-[&_svg]:shrink-0",
      inset && "wa-pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "wa-z-50 wa-min-w-[8rem] wa-overflow-hidden wa-rounded-md wa-border wa-bg-popover wa-p-1 wa-text-popover-foreground wa-shadow-lg wa-data-[state=open]:animate-in wa-data-[state=closed]:animate-out wa-data-[state=closed]:fade-out-0 wa-data-[state=open]:fade-in-0 wa-data-[state=closed]:zoom-out-95 wa-data-[state=open]:zoom-in-95 wa-data-[side=bottom]:slide-in-from-top-2 wa-data-[side=left]:slide-in-from-right-2 wa-data-[side=right]:slide-in-from-left-2 wa-data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "wa-z-50 wa-min-w-[8rem] wa-overflow-hidden wa-rounded-md wa-border wa-bg-popover wa-p-1 wa-text-popover-foreground wa-shadow-md",
        "wa-data-[state=open]:animate-in wa-data-[state=closed]:animate-out wa-data-[state=closed]:fade-out-0 wa-data-[state=open]:fade-in-0 wa-data-[state=closed]:zoom-out-95 wa-data-[state=open]:zoom-in-95 wa-data-[side=bottom]:slide-in-from-top-2 wa-data-[side=left]:slide-in-from-right-2 wa-data-[side=right]:slide-in-from-left-2 wa-data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "wa-relative wa-flex wa-cursor-default wa-select-none wa-items-center wa-gap-2 wa-rounded-sm wa-px-2 wa-py-1.5 wa-text-sm wa-outline-none wa-transition-colors wa-focus:bg-accent wa-focus:text-accent-foreground wa-data-[disabled]:pointer-events-none wa-data-[disabled]:opacity-50 wa-[&>svg]:size-4 wa-[&>svg]:shrink-0",
      inset && "wa-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "wa-relative wa-flex wa-cursor-default wa-select-none wa-items-center wa-rounded-sm wa-py-1.5 wa-pl-8 wa-pr-2 wa-text-sm wa-outline-none wa-transition-colors wa-focus:bg-accent wa-focus:text-accent-foreground wa-data-[disabled]:pointer-events-none wa-data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="wa-absolute wa-left-2 wa-flex wa-h-3.5 wa-w-3.5 wa-items-center wa-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "wa-relative wa-flex wa-cursor-default wa-select-none wa-items-center wa-rounded-sm wa-py-1.5 wa-pl-8 wa-pr-2 wa-text-sm wa-outline-none wa-transition-colors wa-focus:bg-accent wa-focus:text-accent-foreground wa-data-[disabled]:pointer-events-none wa-data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="wa-absolute wa-left-2 wa-flex wa-h-3.5 wa-w-3.5 wa-items-center wa-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "wa-px-2 wa-py-1.5 wa-text-sm wa-font-semibold",
      inset && "wa-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-wa-mx-1 wa-my-1 wa-h-px wa-bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("wa-ml-auto wa-text-xs wa-tracking-widest wa-opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
