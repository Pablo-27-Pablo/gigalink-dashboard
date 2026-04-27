"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Filter, Download, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HistoryVoucher {
  id: string;
  code: string;
  plan: string;
  status: "Expired" | "Data Exhausted" | "Expired & Exhausted";
  date: string;
  details?: string;
}

const historyData: HistoryVoucher[] = [
  {
    id: "h1",
    code: "VCH-BAS-005",
    plan: "Basic",
    status: "Expired",
    date: "2024-01-01",
  },
  {
    id: "h2",
    code: "VCH-PRE-007",
    plan: "Premium",
    status: "Expired",
    date: "2024-02-15",
  },
  {
    id: "h3",
    code: "VCH-STD-009",
    plan: "Standard",
    status: "Data Exhausted",
    date: "2024-02-10",
  },
  {
    id: "h4",
    code: "VCH-BAS-010",
    plan: "Basic",
    status: "Data Exhausted",
    date: "2024-01-25",
  },
  {
    id: "h5",
    code: "VCH-UNL-011",
    plan: "Unlimited",
    status: "Expired",
    date: "2024-01-20",
  },
  {
    id: "h6",
    code: "VCH-STD-012",
    plan: "Standard",
    status: "Data Exhausted",
    date: "2024-02-05",
  },
  {
    id: "h7",
    code: "VCH-PRE-013",
    plan: "Premium",
    status: "Expired & Exhausted",
    date: "Expired: 2024-01-15, Exhausted: 2024-01-10",
    details: "Expired: 2024-01-15, Exhausted: 2024-01-10",
  },
  {
    id: "h8",
    code: "VCH-BAS-014",
    plan: "Basic",
    status: "Expired",
    date: "2023-12-31",
  },
  {
    id: "h9",
    code: "VCH-STD-015",
    plan: "Standard",
    status: "Data Exhausted",
    date: "2024-01-30",
  },
  {
    id: "h10",
    code: "VCH-PRE-016",
    plan: "Premium",
    status: "Expired",
    date: "2024-02-01",
  },
];

function getStatusBadgeStyles(
  status: HistoryVoucher["status"],
  theme: "light" | "dark",
  mounted: boolean,
) {
  if (status === "Expired") {
    return {
      bg:
        mounted && theme === "dark"
          ? "bg-[rgba(126,42,12,0.30)]"
          : "bg-orange-100",
      text: mounted && theme === "dark" ? "text-[#FFB86A]" : "text-orange-600",
      icon: "#FFB86A",
    };
  }
  if (status === "Data Exhausted") {
    return {
      bg:
        mounted && theme === "dark"
          ? "bg-[rgba(130,24,26,0.30)]"
          : "bg-red-100",
      text: mounted && theme === "dark" ? "text-[#FFA2A2]" : "text-red-600",
      icon: "#FFA2A2",
    };
  }
  return {
    bg: mounted && theme === "dark" ? "bg-[#314158]" : "bg-slate-200",
    text: mounted && theme === "dark" ? "text-[#CAD5E2]" : "text-slate-600",
    icon: mounted && theme === "dark" ? "#CAD5E2" : "#64748B",
  };
}

function StatusBadge({
  status,
  theme,
  mounted,
}: {
  status: HistoryVoucher["status"];
  theme: "light" | "dark";
  mounted: boolean;
}) {
  const styles = getStatusBadgeStyles(status, theme, mounted);

  const getIcon = () => {
    if (status === "Expired" || status === "Expired & Exhausted") {
      return <Clock size={12} style={{ color: styles.icon }} />;
    }
    return <AlertCircle size={12} style={{ color: styles.icon }} />;
  };

  return (
    <div
      className={cn(
        "h-6 px-2.5 rounded-full flex items-center gap-1.5",
        styles.bg,
      )}
    >
      {getIcon()}
      <span className={cn("text-xs font-normal", styles.text)}>{status}</span>
    </div>
  );
}

export function VendorVoucherHistory() {
  const { theme, mounted } = useTheme();
  const [history] = useState<HistoryVoucher[]>(historyData);

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-full p-4 lg:p-6",
        mounted && theme === "dark" ? "bg-[#1E293B]" : "bg-slate-50",
      )}
    >
      <div className="w-full flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/vendor/vouchers"
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors w-fit",
            mounted && theme === "dark"
              ? "text-[#90A1B9] hover:text-white"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <ArrowLeft size={16} />
          Back to Vouchers
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            <h1
              suppressHydrationWarning
              className={cn(
                "text-2xl lg:text-[32px] font-extrabold",
                mounted && theme === "dark" ? "text-white" : "text-slate-900",
              )}
            >
              Voucher History
            </h1>
            <p
              suppressHydrationWarning
              className={cn(
                "text-base",
                mounted && theme === "dark"
                  ? "text-[#90A1B9]"
                  : "text-slate-500",
              )}
            >
              View all expired and used vouchers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[10px] text-base transition-colors",
                mounted && theme === "dark"
                  ? "bg-[#1D293D] text-[#E2E8F0] hover:bg-[#314158]"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200",
              )}
            >
              <Filter size={16} />
              Filters
            </button>
            <button
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[10px] text-base transition-colors",
                mounted && theme === "dark"
                  ? "bg-[#00BBA7] text-white hover:bg-[#00a395]"
                  : "bg-teal-500 text-white hover:bg-teal-600",
              )}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Count */}
        <p
          suppressHydrationWarning
          className={cn(
            "text-sm",
            mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
          )}
        >
          Showing 10 of 10 expired/used vouchers
        </p>

        {/* Table */}
        <div
          suppressHydrationWarning
          className={cn(
            "rounded-[14px] overflow-hidden",
            mounted && theme === "dark"
              ? "bg-[#1D293D] border border-[#314158]"
              : "bg-white border border-slate-200 shadow-md",
          )}
        >
          {/* Table Header */}
          <div
            className={cn(
              "grid grid-cols-4 gap-4 px-6 py-3",
              mounted && theme === "dark"
                ? "bg-[rgba(15,23,43,0.50)]"
                : "bg-slate-50",
            )}
          >
            {["Voucher Code", "Plan Name", "Status", "Date"].map((header) => (
              <div
                key={header}
                suppressHydrationWarning
                className={cn(
                  "text-xs font-bold uppercase",
                  mounted && theme === "dark"
                    ? "text-[#CAD5E2]"
                    : "text-slate-600",
                )}
              >
                {header}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {history.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "grid grid-cols-4 gap-4 px-6 py-4 items-center",
                  index !== history.length - 1 &&
                    (mounted && theme === "dark"
                      ? "border-b border-[#314158]"
                      : "border-b border-slate-200"),
                )}
              >
                {/* Voucher Code */}
                <div
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-normal font-mono",
                    mounted && theme === "dark"
                      ? "text-white"
                      : "text-slate-900",
                  )}
                >
                  {item.code}
                </div>

                {/* Plan Name */}
                <div
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-normal",
                    mounted && theme === "dark"
                      ? "text-white"
                      : "text-slate-900",
                  )}
                >
                  {item.plan}
                </div>

                {/* Status */}
                <div>
                  <StatusBadge
                    status={item.status}
                    theme={theme}
                    mounted={mounted}
                  />
                </div>

                {/* Date */}
                <div
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-normal",
                    mounted && theme === "dark"
                      ? "text-[#90A1B9]"
                      : "text-slate-500",
                  )}
                >
                  {item.details || item.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
