"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md text-xs  px-3 py-1.5  text-neutral-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 bg-grey-800",
      className
    )}
    {...props} />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName


export const TooltipRoot = React.forwardRef((props, ref) => {
  const { useTouch = false, children, ...restProps } = props;
  const [open, setOpen] = React.useState(false);

  const handleTouch = (event) => {
    event.persist();
    setOpen(true);
  };

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...restProps}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && useTouch) {
          return React.cloneElement(child, {
            onTouchStart: handleTouch,
            onMouseDown: handleTouch,
          });
        }
        return child;
      })}
    </TooltipPrimitive.Root>
  );
});

TooltipRoot.displayName = TooltipPrimitive.Root.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
