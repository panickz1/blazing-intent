'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useScrollViewport } from '@/components/ui/scroll-area';

const DONE_AT = 0.995;

function Bar({ container, target }) {
  const containerRef = useRef(container);
  const targetRef = useRef(target);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 380, damping: 42, restDelta: 0.001 });

  const [finished, setFinished] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setFinished(v >= DONE_AT));

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-50 h-0.5 w-full transition-opacity ${
        finished ? 'opacity-0 delay-200 duration-500' : 'opacity-100 duration-200'
      }`}
    >
      <motion.div className="h-full w-full origin-left bg-primary" style={{ scaleX }} />
    </div>
  );
}

export default function ArticleProgressBar({ targetSelector = '.article-prose' }) {
  const viewport = useScrollViewport();
  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    let live = true;
    queueMicrotask(() => {
      const container = viewport || document.querySelector('[data-scroll-root]');
      const target = document.querySelector(targetSelector);
      if (live && container && target) setNodes({ container, target });
    });
    return () => {
      live = false;
    };
  }, [viewport, targetSelector]);

  if (!nodes) return null;
  return <Bar key={viewport ? 'viewport' : 'fallback'} container={nodes.container} target={nodes.target} />;
}
