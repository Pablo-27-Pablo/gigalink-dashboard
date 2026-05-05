"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  LayoutDashboard,
  Wifi,
  ChevronLeft,
  Laptop,
  Moon,
  Sun,
  History,
  LogOut,
  UserCircle,
  Users, // Added for Vendor Management icon
  ShelvingUnit, // Placeholder for Inventory icon, replace with actual icon
} from "lucide-react";
import DashboardNavbar from "@/components/dashboard/navbar/DashboardNavbar";
import Cookies from "js-cookie";
import { toast } from "sonner";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/",
    roles: ["seller"], // Vendor only
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
    roles: ["seller"], // Vendor only
  },
  {
    label: "History",
    icon: History,
    href: "/dashboard/history",
    roles: ["seller"], // Vendor only
  },
  {
    label: "Inventory",
    icon: ShelvingUnit, // Replace with actual icon
    href: "/dashboard/request",
    roles: ["distributor"], // Distributor only
  },
  {
    label: "Distributor Management",
    icon: UserCircle,
    href: "/dashboard/admin",
    roles: ["superadmin"], // Both can see
  },
  {
    label: "Voucher Assigment",
    icon: UserCircle,
    href: "/dashboard/voucher-assignment",
    roles: ["superadmin"], // Both can see
  },
  {
    label: "Transfer Logs",
    icon: UserCircle,
    href: "/dashboard/transfer-logs",
    roles: ["superadmin"], // Both can see
  },
  {
    label: "Profile",
    icon: UserCircle,
    href: "/dashboard/profile",
    roles: ["seller", "distributor", "superadmin"], // Both can see
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState(""); // for RBAC
  const { theme, toggleTheme } = useTheme();

  // Filter items based on the current role state
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  const handleSignOut = () => {
    const keys = ["session2", "distributorId", "vendorId", "superadminId"];
    keys.forEach((key) => {
      Cookies.remove(key, { path: "/" });
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
    });

    sessionStorage.setItem("signedOut", "true");
    router.refresh();

    toast.success("Signed out successfully");
    window.setTimeout(() => window.location.replace("/login"), 300);
  };

  useEffect(() => {
    const sessionToken = Cookies.get("session2");
    if (!sessionToken) {
      window.location.replace("/login");
      return;
    }

    if (sessionToken) {
      try {
        // 1. Split the token (Header.Payload.Signature)
        const base64Url = sessionToken.split(".")[1];
        // 2. Replace URL-safe characters and decode
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );

        const payload = JSON.parse(jsonPayload);

        setRole(payload.portal); // Assuming 'portal' field contains the role

        // Example: access a specific field like distributorId
        // console.log(payload.id);
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!Cookies.get("session2")) {
        window.location.replace("/login");
        return;
      }

      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

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
              onClick={(event) => {
                event.preventDefault();
                // Use replace so dashboard navigation doesn't stack history entries
                router.replace(href);
              }}
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
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
              collapsed && "justify-center",
            )}
          >
            {theme === "system" ? (
              <Laptop size={16} />
            ) : theme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
            {!collapsed && (
              <span>
                {theme === "system"
                  ? "System"
                  : theme === "dark"
                    ? "Light Mode"
                    : "Dark Mode"}
              </span>
            )}
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
      {/* <main className="flex-1 overflow-y-auto relative">
        <DashboardNavbar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          role={role}
        />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </main> */}
      <main className="flex flex-col h-screen w-full overflow-y-auto">
        {/* The Navbar stays at the top naturally in the flex column */}
        <DashboardNavbar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          role={role}
        />

        {/* This div grows to fill space and handles the scrolling */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </main>
    </div>
  );
}
