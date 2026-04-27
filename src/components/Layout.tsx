"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wifi,
  // Settings,
  ChevronLeft,
  Moon,
  Sun,
  History,
  LogOut,
  UserCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Services", icon: Wifi, href: "/services" },
  { label: "History", icon: History, href: "/history" },
  { label: "Profile", icon: UserCircle, href: "/profile" },
  // { label: "Settings",  icon: Settings,        href: "/settings"  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const router = useRouter();

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Sidebar — fixed height, never scrolls */}
      <aside
        className={cn(
          "flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-56",
        )}
      >
        {/* Logo -- to change pa */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-slate-700">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Image
                src="/gigalogo.png"
                alt="GigaLink"
                width={24}
                height={24}
              />
              <span className="font-bold text-teal-600 dark:text-teal-400 text-lg tracking-tight">
                GIGALINK
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <ChevronLeft
              size={18}
              className={cn("transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
          {navItems.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-300 transition-colors",
                collapsed && "justify-center",
              )}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </a>
          ))}
        </nav>

        {/* Bottom buttons */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
          <button
            onClick={toggleDark}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
              collapsed && "justify-center",
            )}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors",
              collapsed && "justify-center",
            )}
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content — scrolls independently */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
