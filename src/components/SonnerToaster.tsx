"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/providers/ThemeProvider";

export function SonnerToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      theme={resolvedTheme}
      toastOptions={{
        classNames: {
          toast:
            "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-700 shadow-lg",
          description: "text-slate-600 dark:text-slate-300",
          actionButton:
            "bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600",
          cancelButton:
            "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-50",
        },
      }}
    />
  );
}

