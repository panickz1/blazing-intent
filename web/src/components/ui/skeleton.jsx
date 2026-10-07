import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-neutral-100 dark:bg-black/20", className)}
      {...props} />
  );
}

export { Skeleton }
