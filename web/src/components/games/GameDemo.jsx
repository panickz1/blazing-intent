"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, Play, X } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
  useIsMobile,
} from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";

function Frame({ src, name, className }) {
  return (
    <iframe
      src={src}
      title={name}
      allow="autoplay; fullscreen; clipboard-write"
      allowFullScreen
      className={cn("block size-full border-0 bg-black", className)}
    />
  );
}

export default function GameDemo({ src, name, thumbnail, className }) {
  const labels = site.games;
  const isMobile = useIsMobile();
  const [playing, setPlaying] = useState(false);
  const stage = useRef(null);

  const fullscreen = () => stage.current?.requestFullscreen?.();

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-grey-800 bg-grey-950", className)}>
      <div ref={stage} className="relative aspect-[4/3] w-full bg-black sm:aspect-video">
        {playing && !isMobile ? (
          <Frame src={src} name={name} />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 grid place-items-center overflow-hidden"
          >
            {thumbnail?.src && (
              <Image
                src={thumbnail.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="scale-110 object-cover opacity-40 blur-md"
                priority
              />
            )}
            <span className="relative flex flex-col items-center gap-4">
              {thumbnail?.src && (
                <Image
                  src={thumbnail.src}
                  alt={name}
                  width={thumbnail.width}
                  height={thumbnail.height}
                  className="w-[200px] rounded-xl shadow-2xl ring-1 ring-white/10 sm:w-[260px]"
                />
              )}
              <span className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-heading text-[16px] font-black text-primary-foreground shadow-lg transition-transform group-hover:scale-[1.03]">
                <Play className="size-4 fill-current" aria-hidden />
                {labels.playLabel}
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-grey-800 px-4 py-2.5">
        <p className="m-0 text-[12px] text-fg-muted">{labels.demoNote}</p>
        {playing && !isMobile && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={fullscreen}
              className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-grey-200 transition-colors hover:bg-grey-800 hover:text-white"
            >
              <Maximize2 className="size-3.5" aria-hidden />
              {labels.fullscreenLabel}
            </button>
            <button
              type="button"
              onClick={() => setPlaying(false)}
              aria-label={labels.closeLabel}
              title={labels.closeLabel}
              className="grid size-8 place-items-center rounded-md text-grey-200 transition-colors hover:bg-grey-800 hover:text-white"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>

      {isMobile && (
        <ResponsiveDialog open={playing} onOpenChange={setPlaying}>
          <ResponsiveDialogContent className="h-[92dvh]">
            <ResponsiveDialogTitle className="sr-only">{name}</ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="sr-only">{labels.demoNote}</ResponsiveDialogDescription>
            {playing && <Frame src={src} name={name} className="h-[calc(92dvh-72px)] rounded-xl" />}
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      )}
    </div>
  );
}
