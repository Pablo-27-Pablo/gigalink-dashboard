"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wifi,
  ChevronLeft,
  Moon,
  Sun,
  History,
  LogOut,
  UserCircle,
  Users, // Added for Vendor Management icon
} from "lucide-react";
import DashboardNavbar from "@/components/dashboard/navbar/DashboardNavbar";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/",
    roles: ["vendor"], // Vendor only
  },
  {
    label: "Vendor Management",
    icon: Users,
    href: "/dashboard/distributor",
    roles: ["distributor"], // Distributor only
  },
  {
    label: "Services",
    icon: Wifi,
    href: "/dashboard/services",
    roles: ["vendor"], // Vendor only
  },
  {
    label: "History",
    icon: History,
    href: "/dashboard/history",
    roles: ["vendor"], // Vendor only
  },
  {
    label: "Request Voucher",
    icon: UserCircle,
    href: "/dashboard/request",
    roles: ["distributor"], // Distributor only
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/dashboard/profile",
    roles: ["vendor", "distributor"], // Both can see
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState("distributor"); // for RBAC

  // Filter items based on the current role state
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 shrink-0 z-20",
          collapsed ? "w-16" : "w-56",
        )}
      >
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {/* Changed navItems to filteredNavItems */}
          {filteredNavItems.map(({ label, icon: Icon, href }) => (
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <DashboardNavbar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          role={role}
        />
        <div className="">{children}</div>
      </main>
    </div>
  );
}
