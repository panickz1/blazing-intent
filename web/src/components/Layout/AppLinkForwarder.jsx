"use client";

import { useEffect } from "react";
import { site } from "@/site.config";

const GROUPS = site.attribution.forwardParams;

const STORAGE_KEY = `${site.attribution.storageKey}.forward`;

const APP_HOST = (() => {
  try {
    return new URL(site.cta.url).hostname;
  } catch {
    return null;
  }
})();

let remembered;

function forwardable(search) {
  const incoming = new URLSearchParams(search);
  const params = {};
  for (const key of GROUPS.flat()) {
    const value = incoming.get(key);
    if (value) params[key] = value;
  }
  return Object.keys(params).length > 0 ? params : null;
}

function merge(stored, landing) {
  const next = { ...stored };
  for (const group of GROUPS) {
    if (!group.some((key) => key in landing)) continue;
    for (const key of group) {
      if (key in landing) next[key] = landing[key];
      else delete next[key];
    }
  }
  return next;
}

function save(params) {
  remembered = params;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
  }
}

function load() {
  if (remembered !== undefined) return remembered;
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
    remembered = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    remembered = null;
  }
  return remembered;
}

function decorate(event) {
  const anchor = event.target?.closest?.("a[href]");
  if (!anchor || !APP_HOST || anchor.hostname !== APP_HOST) return;
  const params = load();
  if (!params) return;

  const url = new URL(anchor.href);
  const own = [...url.searchParams.keys()];
  let changed = false;
  for (const group of GROUPS) {
    if (group.some((key) => own.includes(key))) continue;
    for (const key of group) {
      if (typeof params[key] !== "string") continue;
      url.searchParams.set(key, params[key]);
      changed = true;
    }
  }
  if (changed) anchor.href = url.toString();
}

export default function AppLinkForwarder() {
  useEffect(() => {
    const landing = forwardable(window.location.search);
    if (landing) save(merge(load() ?? {}, landing));

    document.addEventListener("pointerdown", decorate, true);
    document.addEventListener("click", decorate, true);
    return () => {
      document.removeEventListener("pointerdown", decorate, true);
      document.removeEventListener("click", decorate, true);
    };
  }, []);

  return null;
}
