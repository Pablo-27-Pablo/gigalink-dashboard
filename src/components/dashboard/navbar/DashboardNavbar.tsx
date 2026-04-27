import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"
import GigaLogo from "../../../../public/gigalogo.png"
import DarkGigaLogo from "../../../../public/darkgigalogo.png"

// 1. Define the props interface
interface DashboardNavbarProps {
  onToggleSidebar: () => void;
  role: string;
}

export default function DashboardNavbar({ onToggleSidebar, role }: DashboardNavbarProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 py-4 transition-colors",
        "bg-white border-b border-slate-100",
        "dark:bg-slate-900 dark:border-slate-800",
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar} // 2. Attach the click handler
          className={cn(
            "p-2 rounded-lg transition-colors",
            "text-slate-600 hover:bg-slate-50",
            "dark:text-slate-400 dark:hover:bg-slate-800",
          )}
        >
          <Menu size={24} />
        </button>
        <span className={cn("text-xl font-semibold text-[#00c9b7] capitalize")}>
          {role} {/* 3. Make the role dynamic */}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className={cn("flex items-center gap-1 font-extrabold text-[#001b79] dark:text-white text-2xl tracking-tight")}>
          <Image
            src={GigaLogo}
            alt="GigaLink"
            width={100}
            height={100}
            className="block dark:hidden"
          />
          <Image
            src={DarkGigaLogo}
            alt="GigaLink"
            width={100}
            height={100}
            className="hidden dark:block"
          />
        </div>
      </div>
    </nav>
  );
}