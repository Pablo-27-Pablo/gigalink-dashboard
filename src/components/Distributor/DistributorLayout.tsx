"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  LogOut,
  Menu,
  X,
  Briefcase,
  Send,
  User,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  // { name: "Dashboard",          path: "/distributor/dashboard",  icon: LayoutDashboard },
  { name: "Vendor Management", path: "/distributor/vendors", icon: Users },
  // { name: "Voucher Management", path: "/distributor/vouchers",   icon: Ticket          },
  // { name: "Voucher Assignment", path: "/distributor/assignment", icon: PackageCheck    },
  { name: "Request Vouchers", path: "/distributor/request", icon: Send },
  // { name: "Sales Monitoring",   path: "/distributor/sales",      icon: BarChart3       },
  // { name: "Activity Logs",      path: "/distributor/logs",       icon: Settings        },
  { name: "Profile", path: "/distributor/profile", icon: User },
];

function SidebarContent({
  theme,
  toggleTheme,
  handleSignOut,
  onNavClick,
  pathname,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
  handleSignOut: () => void;
  onNavClick: () => void;
  pathname: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname && pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors text-sm font-medium",
                isActive
                  ? "bg-[#0B4F4A]/20 text-[#00D5BE]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          suppressHydrationWarning
        >
          {theme === "dark" ? (
            <>
              <Sun size={20} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={20} />
              <span>Dark Mode</span>
            </>
          )}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function DistributorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => router.push("/portal-selection");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white shrink-0">
              <Briefcase size={16} />
            </div>
            <span className="font-bold text-xl text-blue-500">Distributor</span>
          </div>
        </div>
      </div>

      <div className="flex h-screen lg:h-screen overflow-hidden">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:hidden"
              >
                <SidebarContent
                  theme={theme}
                  toggleTheme={toggleTheme}
                  handleSignOut={handleSignOut}
                  onNavClick={() => setIsSidebarOpen(false)}
                  pathname={pathname}
                />
              </motion.aside>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 transition-all duration-300",
            isSidebarCollapsed
              ? "w-0 opacity-0 overflow-hidden"
              : "w-64 opacity-100",
          )}
        >
          <SidebarContent
            theme={theme}
            toggleTheme={toggleTheme}
            handleSignOut={handleSignOut}
            onNavClick={() => {}}
            pathname={pathname}
          />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="hidden lg:flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isSidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
              </button>
              <span className="font-bold text-xl text-[#00D5BE]">
                Distributor
              </span>
            </div>
            <Image
              src="/gigalogo.png"
              alt="GigaLink"
              width={120}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </header>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
