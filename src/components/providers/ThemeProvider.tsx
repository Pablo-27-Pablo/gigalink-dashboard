"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

type ResolvedTheme = "light" | "dark";
type ThemeSetting = ResolvedTheme | "system";

interface ThemeContextValue {
  theme: ThemeSetting;
  resolvedTheme: ResolvedTheme;
  mounted: boolean;
  setTheme: (theme: ThemeSetting) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isThemeSetting(value: unknown): value is ThemeSetting {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme: ResolvedTheme) {
  // Tailwind `darkMode: "class"` expects a `dark` class on <html>.
  // We only toggle `dark` to avoid fighting existing classes.
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSetting>(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme");
    return isThemeSetting(savedTheme) ? savedTheme : "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme(),
  );
  const [mounted, setMounted] = useState(false);

  const setTheme = useCallback((nextTheme: ThemeSetting) => {
    const safeTheme: ThemeSetting = isThemeSetting(nextTheme)
      ? nextTheme
      : "system";
    setThemeState(safeTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      // Cycle: system -> light -> dark -> system
      const next: ThemeSetting =
        prev === "system" ? "light" : prev === "light" ? "dark" : "system";
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    // Resolve and apply the theme class as early as possible.
    const nextResolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(nextResolved);
    applyThemeClass(nextResolved);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const nextResolved = getSystemTheme();
      setResolvedTheme(nextResolved);
      applyThemeClass(nextResolved);
    };

    // Set initial in case OS theme changed before mount.
    onChange();

    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    } else {
      // Safari fallback - Cast to 'any' or 'MediaQueryList' to fix the 'never' error
      (mql as MediaQueryList).addListener(onChange);
      return () => (mql as MediaQueryList).removeListener(onChange);
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      mounted,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, mounted, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return context;
}
