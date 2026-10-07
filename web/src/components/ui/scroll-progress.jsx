"use client";;
import { cn } from "@/lib/utils";
import { motion, useScroll } from "motion/react";
import React from "react";
import { useScrollViewport } from "@/components/ui/scroll-area";

function ScrollProgressInner({ viewport, forwardedRef, className, ...props }) {
  const container = viewport || (typeof document !== "undefined" && document.querySelector("[data-scroll-root]")) || null;
  const containerRef = React.useRef(container);
  const { scrollYProgress } = useScroll(container ? { container: containerRef } : undefined);

  return (
    <motion.div
      ref={forwardedRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-primary via-primary to-accent-2",
        className
      )}
      style={{ scaleX: scrollYProgress }}
      {...props}
    />
  );
}

export const ScrollProgress = React.forwardRef((props, ref) => {
  const viewport = useScrollViewport();
  return <ScrollProgressInner key={viewport ? "viewport" : "window"} viewport={viewport} forwardedRef={ref} {...props} />;
});

ScrollProgress.displayName = "ScrollProgress";
