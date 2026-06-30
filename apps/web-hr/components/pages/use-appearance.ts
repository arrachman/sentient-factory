"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { makeTranslator, type Translator } from "@/lib/i18n";
import { notify } from "@/lib/feedback";
import {
  DEFAULTS,
  STORAGE_KEY,
  type Density,
  type FontScale,
  type Lang,
  type SidebarMode,
  type SidebarMenuMode,
  type Tweaks,
} from "./appearance-parts";

export interface UseAppearanceResult {
  tw: Tweaks;
  t: Translator;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  applyTweak: <K extends keyof Tweaks>(key: K, val: Tweaks[K]) => void;
  resetAll: () => void;
  fontScale: FontScale;
}

// HR has no per-user preferences backend (auth = platform `sf_token`, not
// `erp_token`, and the gateway exposes no `/user-preferences` for HR). So unlike
// ERP/MDP, appearance persists to localStorage only (`hr-appearance`) — the same
// key the blocking init script in `app/layout.tsx` reads to avoid FOUC. Theme is
// owned by next-themes (`hr-theme`).
export function useAppearance(): UseAppearanceResult {
  const { theme, setTheme } = useTheme();
  const [tw, setTw] = React.useState<Tweaks>(DEFAULTS);
  const t = React.useMemo(() => makeTranslator(tw.lang), [tw.lang]);

  const applyToDom = React.useCallback((next: Tweaks) => {
    const el = document.documentElement;
    el.setAttribute("data-primary", next.primary);
    el.setAttribute("data-density", next.density);
    el.setAttribute("data-fontscale", next.fontScale);
    el.setAttribute("data-sidebar", next.sidebar);
    el.setAttribute("data-sidebar-menu", next.sidebarMenu || "flyout");
  }, []);

  // Hydrate local state from localStorage / DOM attributes on mount.
  // Order: localStorage > DOM attr > DEFAULTS.
  React.useEffect(() => {
    const el = document.documentElement;
    let stored: Partial<Tweaks> = {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Partial<Tweaks>;
    } catch {
      stored = {};
    }
    const baseline: Tweaks = {
      primary:
        stored.primary ?? el.getAttribute("data-primary") ?? DEFAULTS.primary,
      density:
        (stored.density as Density) ??
        (el.getAttribute("data-density") as Density) ??
        DEFAULTS.density,
      fontScale:
        (stored.fontScale as FontScale) ??
        (el.getAttribute("data-fontscale") as FontScale) ??
        DEFAULTS.fontScale,
      sidebar:
        (stored.sidebar as SidebarMode) ??
        (el.getAttribute("data-sidebar") as SidebarMode) ??
        DEFAULTS.sidebar,
      sidebarMenu:
        (stored.sidebarMenu as SidebarMenuMode) ??
        (el.getAttribute("data-sidebar-menu") as SidebarMenuMode) ??
        DEFAULTS.sidebarMenu,
      lang: (stored.lang as Lang) ?? DEFAULTS.lang,
      urlRouting: stored.urlRouting ?? DEFAULTS.urlRouting,
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hydration from localStorage (client-only)
    setTw(baseline);
    applyToDom(baseline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const twRef = React.useRef(tw);
  React.useEffect(() => {
    twRef.current = tw;
  }, [tw]);

  const persist = React.useCallback((next: Tweaks) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  const applyTweak = React.useCallback(
    <K extends keyof Tweaks>(key: K, val: Tweaks[K]) => {
      const next = { ...twRef.current, [key]: val };
      twRef.current = next;
      applyToDom(next);
      persist(next);
      setTw(next);
    },
    [applyToDom, persist],
  );

  const resetAll = React.useCallback(() => {
    setTheme("light");
    setTw(DEFAULTS);
    twRef.current = DEFAULTS;
    applyToDom(DEFAULTS);
    persist(DEFAULTS);
    notify(
      makeTranslator(DEFAULTS.lang)("Tampilan dikembalikan ke bawaan"),
      "info",
    );
  }, [setTheme, applyToDom, persist]);

  const fontScale: FontScale = tw.fontScale || "base";

  return { tw, t, theme, setTheme, applyTweak, resetAll, fontScale };
}
