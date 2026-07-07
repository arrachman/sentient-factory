"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { makeTranslator, type Translator } from "@/lib/i18n";
import { notify } from "@/lib/feedback";
import {
  getMyPreferences,
  updateMyPreferences,
  HrApiError,
} from "@/lib/api";
import { SET_EVENT, HYDRATE_EVENT } from "@/lib/use-url-routing";
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

// Appearance persistence (1:1 port of web-erp):
//   - localStorage (`hr-appearance`) = optimistic mirror, read by the blocking
//     init script in `app/layout.tsx` to avoid FOUC.
//   - backend `/hr/user-preferences/me` = server SSOT (cross-device). On mount
//     we hydrate from the API (API > localStorage > DOM > DEFAULTS); after
//     hydration every tweak debounce-saves (500ms) to the server.
// Theme is owned by next-themes (`hr-theme`); we sync it to the API too.
export function useAppearance(): UseAppearanceResult {
  const { theme, setTheme } = useTheme();
  const [tw, setTw] = React.useState<Tweaks>(DEFAULTS);
  const t = React.useMemo(() => makeTranslator(tw.lang), [tw.lang]);
  const hydratedRef = React.useRef(false);
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyToDom = React.useCallback((next: Tweaks) => {
    const el = document.documentElement;
    el.setAttribute("data-primary", next.primary);
    el.setAttribute("data-density", next.density);
    el.setAttribute("data-fontscale", next.fontScale);
    el.setAttribute("data-sidebar", next.sidebar);
    el.setAttribute("data-sidebar-menu", next.sidebarMenu || "flyout");
  }, []);

  const persistLocal = React.useCallback((next: Tweaks) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  // Notify the shell (lib/use-url-routing.ts) when the Per-page URL mode changes
  // so the tab strip show/hide + tab accumulation react live without a reload.
  const notifyUrlRouting = React.useCallback(
    (enabled: boolean, hydrate: boolean) => {
      if (typeof window === "undefined") return;
      window.dispatchEvent(
        new CustomEvent(hydrate ? HYDRATE_EVENT : SET_EVENT, { detail: { enabled } }),
      );
    },
    [],
  );

  // Hydrate: localStorage > DOM > DEFAULTS first (synchronous), then override
  // with the server SSOT once /hr/user-preferences/me resolves.
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot server-SSOT hydration (client-only)
    setTw(baseline);

    let cancelled = false;
    getMyPreferences()
      .then((prefs) => {
        if (cancelled || !prefs) {
          hydratedRef.current = true;
          return;
        }
        const meta = (prefs.metadata ?? {}) as Partial<Tweaks>;
        const merged: Tweaks = {
          primary: meta.primary ?? baseline.primary,
          density: (meta.density as Density) ?? baseline.density,
          fontScale: (meta.fontScale as FontScale) ?? baseline.fontScale,
          sidebar: (meta.sidebar as SidebarMode) ?? baseline.sidebar,
          sidebarMenu:
            (meta.sidebarMenu as SidebarMenuMode) ?? baseline.sidebarMenu,
          lang: (prefs.language as Lang) ?? baseline.lang,
          urlRouting: meta.urlRouting ?? baseline.urlRouting,
        };
        setTw(merged);
        applyToDom(merged);
        if (prefs.theme) setTheme(prefs.theme);
        // Mirror server SSOT → localStorage so the FOUC init script matches.
        persistLocal(merged);
        // Sync the shell's urlRouting flag from the server SSOT (hydrate, no
        // workspace reset — the shell just adopts the persisted mode).
        notifyUrlRouting(merged.urlRouting, true);
        hydratedRef.current = true;
      })
      .catch(() => {
        // Not logged in / endpoint unavailable — fall back to localStorage only.
        hydratedRef.current = true;
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const twRef = React.useRef(tw);
  React.useEffect(() => {
    twRef.current = tw;
  }, [tw]);

  const applyTweak = React.useCallback(
    <K extends keyof Tweaks>(key: K, val: Tweaks[K]) => {
      const next = { ...twRef.current, [key]: val };
      twRef.current = next;
      applyToDom(next);
      persistLocal(next);
      setTw(next);
      // Toggling URL Routing switches the shell mode live (tab strip + tab
      // accumulation). Fire the set event so useUrlRoutingFlag re-reads it.
      if (key === "urlRouting") notifyUrlRouting(Boolean(val), false);
    },
    [applyToDom, persistLocal, notifyUrlRouting],
  );

  // Debounce-save to the backend whenever theme or tw changes (post-hydration).
  React.useEffect(() => {
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateMyPreferences({
        theme: theme ?? "light",
        language: tw.lang,
        metadata: {
          primary: tw.primary,
          density: tw.density,
          fontScale: tw.fontScale,
          sidebar: tw.sidebar,
          sidebarMenu: tw.sidebarMenu,
          urlRouting: tw.urlRouting,
        },
      }).catch((err) => {
        const msg =
          err instanceof HrApiError
            ? err.message
            : t("Gagal menyimpan preferensi tampilan");
        notify(msg, "danger");
      });
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, tw]);

  const resetAll = React.useCallback(() => {
    setTheme("light");
    setTw(DEFAULTS);
    twRef.current = DEFAULTS;
    applyToDom(DEFAULTS);
    persistLocal(DEFAULTS);
    notifyUrlRouting(DEFAULTS.urlRouting, false);
    notify(
      makeTranslator(DEFAULTS.lang)("Tampilan dikembalikan ke bawaan"),
      "info",
    );
  }, [setTheme, applyToDom, persistLocal, notifyUrlRouting]);

  const fontScale: FontScale = tw.fontScale || "base";

  return { tw, t, theme, setTheme, applyTweak, resetAll, fontScale };
}
