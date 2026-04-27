"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Wifi,
  History,
  User,
  Moon,
  Sun,
  Ticket,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  { name: "Dashboard", path: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "Services", path: "/vendor/services", icon: Wifi },
  { name: "Active Vouchers", path: "/vendor/vouchers", icon: Ticket },
  { name: "History", path: "/vendor/history", icon: History },
  { name: "Profile", path: "/vendor/profile", icon: User },
];

function SidebarContent({
  theme,
  mounted,
  toggleTheme,
  handleSignOut,
  onNavClick,
  pathname,
}: {
  theme: "light" | "dark";
  mounted: boolean;
  toggleTheme: () => void;
  handleSignOut: () => void;
  onNavClick: () => void;
  pathname: string;
}) {
  return (
    <div
      suppressHydrationWarning
      className={cn(
        "flex flex-col h-full",
        mounted && theme === "dark" ? "bg-[#0F172B]" : "bg-white",
      )}
    >
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onNavClick}
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-3 px-4 py-3 h-11 rounded-[10px] transition-colors text-sm font-normal",
                isActive
                  ? mounted && theme === "dark"
                    ? "bg-[#0B4F4A]/20 text-[#00D5BE]"
                    : "bg-teal-50 text-teal-600"
                  : mounted && theme === "dark"
                    ? "text-[#90A1B9] hover:bg-[#1D293D] hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div
        suppressHydrationWarning
        className={cn(
          "p-6 border-t",
          mounted && theme === "dark" ? "border-[#1D293D]" : "border-slate-200",
        )}
      >
        <button
          suppressHydrationWarning
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg w-full text-sm font-normal transition-colors",
            mounted && theme === "dark"
              ? "text-[#E2E8F0] hover:bg-[#1D293D]"
              : "text-slate-600 hover:bg-slate-100",
          )}
        >
          {!mounted ? (
            <Moon size={20} />
          ) : theme === "dark" ? (
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
          suppressHydrationWarning
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 px-4 py-3 h-11 rounded-[10px] w-full text-sm font-normal transition-colors mt-2",
            mounted && theme === "dark"
              ? "text-[#90A1B9] hover:bg-[#1D293D] hover:text-red-400"
              : "text-slate-600 hover:bg-slate-100 hover:text-red-500",
          )}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, mounted, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => router.push("/portal-selection");

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-screen transition-colors duration-300",
        mounted && theme === "dark"
          ? "bg-[#0F172B] text-white"
          : "bg-slate-50 text-slate-900",
      )}
    >
      {/* Mobile Header */}
      <div
        suppressHydrationWarning
        className={cn(
          "lg:hidden flex items-center justify-between p-4 border-b sticky top-0 z-20",
          mounted && theme === "dark"
            ? "bg-[#0F172B] border-[#314158]"
            : "bg-white border-slate-200",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            suppressHydrationWarning
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "p-2 rounded-md transition-colors",
              mounted && theme === "dark"
                ? "hover:bg-[#1D293D]"
                : "hover:bg-slate-100",
            )}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span
            suppressHydrationWarning
            className={cn(
              "font-bold text-xl",
              mounted && theme === "dark" ? "text-[#00BBA7]" : "text-teal-600",
            )}
          >
            Vendor
          </span>
        </div>
        <Image
          src="/gigalogo.png"
          alt="GigaLink"
          width={120}
          height={56}
          className="h-10 w-auto object-contain"
          priority
        />
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
                suppressHydrationWarning
                className={cn(
                  "fixed inset-y-0 left-0 z-30 w-64 border-r shadow-xl lg:hidden",
                  mounted && theme === "dark"
                    ? "bg-[#0F172B] border-[#314158]"
                    : "bg-white border-slate-200",
                )}
              >
                <div
                  suppressHydrationWarning
                  className={cn(
                    "p-4 border-b",
                    mounted && theme === "dark"
                      ? "border-[#314158]"
                      : "border-slate-200",
                  )}
                >
                  <span
                    suppressHydrationWarning
                    className={cn(
                      "font-bold text-xl",
                      mounted && theme === "dark"
                        ? "text-[#00BBA7]"
                        : "text-teal-600",
                    )}
                  >
                    Vendor
                  </span>
                </div>
                <SidebarContent
                  theme={theme}
                  mounted={mounted}
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
          suppressHydrationWarning
          className={cn(
            "hidden lg:flex flex-col h-screen sticky top-0 border-r shrink-0 transition-all duration-300",
            mounted && theme === "dark"
              ? "bg-[#0F172B] border-[#314158]"
              : "bg-white border-slate-200",
            isSidebarCollapsed
              ? "w-0 opacity-0 overflow-hidden"
              : "w-64 opacity-100",
          )}
        >
          <SidebarContent
            theme={theme}
            mounted={mounted}
            toggleTheme={toggleTheme}
            handleSignOut={handleSignOut}
            onNavClick={() => {}}
            pathname={pathname}
          />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header
            suppressHydrationWarning
            className={cn(
              "hidden lg:flex items-center justify-between px-6 py-3 border-b sticky top-0 z-10",
              mounted && theme === "dark"
                ? "bg-[#0F172B] border-[#314158]"
                : "bg-white border-slate-200",
            )}
          >
            <div className="flex items-center gap-3">
              <button
                suppressHydrationWarning
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  mounted && theme === "dark"
                    ? "hover:bg-[#1D293D]"
                    : "hover:bg-slate-100",
                )}
              >
                {isSidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
              </button>
              <span
                suppressHydrationWarning
                className={cn(
                  "font-bold text-xl",
                  mounted && theme === "dark"
                    ? "text-[#00BBA7]"
                    : "text-teal-600",
                )}
              >
                Vendor
              </span>
            </div>
            <Image
              src="/gigalogo.png"
              alt="GigaLink"
              width={157}
              height={72}
              className="h-14 w-auto object-contain"
              priority
            />
          </header>
          <main
            suppressHydrationWarning
            className={cn(
              "flex-1 overflow-y-auto",
              // Firefox scrollbar
              mounted && theme === "dark"
                ? "scrollbar-color-[#45556C]_[#1D293D]"
                : "scrollbar-color-slate-400_slate-200",
              // WebKit scrollbar styling via arbitrary variants
              mounted && theme === "dark"
                ? "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1D293D] [&::-webkit-scrollbar-thumb]:bg-[#45556C] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#90A1B9]"
                : "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-200 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-500",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
