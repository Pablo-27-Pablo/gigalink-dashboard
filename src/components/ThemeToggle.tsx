"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        "hover:bg-slate-100 dark:hover:bg-slate-700",
        "text-slate-700 dark:text-slate-200"
      )}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      <span className="text-sm font-medium">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}