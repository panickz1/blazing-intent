"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollViewportContext = React.createContext(null);
export const useScrollViewport = () => React.useContext(ScrollViewportContext);

const ScrollArea = React.forwardRef(({ className, children, viewportClassName, ...props }, ref) => {
  const [viewport, setViewport] = React.useState(null);
  return (
    <ScrollAreaPrimitive.Root ref={ref} type="scroll" scrollHideDelay={600} className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport ref={setViewport} data-scroll-root className={cn("h-full w-full rounded-[inherit]", viewportClassName)}>
        <ScrollViewportContext.Provider value={viewport}>{children}</ScrollViewportContext.Provider>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "z-50 flex touch-none select-none bg-transparent p-0.5 transition-opacity duration-200 data-[state=hidden]:opacity-0",
      orientation === "vertical" && "h-full w-2",
      orientation === "horizontal" && "h-2 flex-col",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-white/15" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
