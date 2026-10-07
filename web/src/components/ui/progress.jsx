"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  let indicatorColor = "bg-success";

  if (value >= 0 && value <= 49) {
    indicatorColor = "bg-destructive";
  } else if (value >= 50 && value <= 79) {
    indicatorColor = "bg-warning";
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      aria-label="Rating"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-grey-950 dark:bg-neutral-800",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 ${indicatorColor} transition-all dark:bg-neutral-50`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }