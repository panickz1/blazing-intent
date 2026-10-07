"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID, analyticsAllowed } from "@/lib/analytics";

const INTERACTIONS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"];

function loadGtag() {
  if (!analyticsAllowed() || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export default function Analytics() {
  useEffect(() => {
    const cleanup = () => {
      INTERACTIONS.forEach((type) => window.removeEventListener(type, trigger));
    };
    function trigger() {
      cleanup();
      loadGtag();
    }

    INTERACTIONS.forEach((type) => window.addEventListener(type, trigger, { once: true, passive: true }));

    return cleanup;
  }, []);

  return null;
}
