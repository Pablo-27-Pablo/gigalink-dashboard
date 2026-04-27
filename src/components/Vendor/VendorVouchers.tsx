"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Filter,
  RefreshCw,
  MoreHorizontal,
  Copy,
  ChevronDown,
} from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  plan: string;
  initial: string;
  dateIssued: string;
  expiryDate: string;
  dataLeft: string;
  dataLeftColor: string;
  status: "Active" | "Expired" | "Used";
}

const vouchersData: Voucher[] = [
  {
    id: "1",
    code: "VCH-BAS-001",
    plan: "Basic Plan",
    initial: "B",
    dateIssued: "2024-01-15",
    expiryDate: "2024-03-15",
    dataLeft: "8.5 GB / 10 GB",
    dataLeftColor: "#FF8904",
    status: "Active",
  },
  {
    id: "2",
    code: "VCH-STD-002",
    plan: "Standard Plan",
    initial: "S",
    dateIssued: "2024-02-01",
    expiryDate: "2024-04-01",
    dataLeft: "15.2 GB",
    dataLeftColor: "#05DF72",
    status: "Active",
  },
  {
    id: "3",
    code: "VCH-PRE-003",
    plan: "Premium Plan",
    initial: "P",
    dateIssued: "2024-01-20",
    expiryDate: "2024-03-20",
    dataLeft: "42.8 GB",
    dataLeftColor: "#05DF72",
    status: "Active",
  },
  {
    id: "4",
    code: "VCH-UNL-004",
    plan: "Unlimited Plan",
    initial: "U",
    dateIssued: "2024-02-10",
    expiryDate: "2024-04-10",
    dataLeft: "98.5 GB",
    dataLeftColor: "#05DF72",
    status: "Active",
  },
  {
    id: "5",
    code: "VCH-STD-006",
    plan: "Standard Plan",
    initial: "S",
    dateIssued: "2024-01-05",
    expiryDate: "2024-03-05",
    dataLeft: "2.3 GB",
    dataLeftColor: "#FF8904",
    status: "Active",
  },
  {
    id: "6",
    code: "VCH-BAS-008",
    plan: "Basic Plan",
    initial: "B",
    dateIssued: "2024-02-18",
    expiryDate: "2024-04-18",
    dataLeft: "9.8 GB",
    dataLeftColor: "#FF8904",
    status: "Active",
  },
];

function VoucherCard({
  voucher,
  mounted,
  theme,
}: {
  voucher: Voucher;
  mounted: boolean;
  theme: "light" | "dark";
}) {
  return (
    <div
      suppressHydrationWarning
      className={cn(
        "w-full p-4 rounded-[14px] flex flex-col gap-4",
        mounted && theme === "dark"
          ? "bg-[#1D293D] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_rgba(0,0,0,0.10)] border border-[#314158]"
          : "bg-white shadow-md border border-slate-200",
      )}
    >
      {/* Header with icon and voucher info */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            mounted && theme === "dark" ? "bg-[#0B4F4A]/30" : "bg-teal-100",
          )}
        >
          <span
            className={cn(
              "text-lg font-bold",
              mounted && theme === "dark" ? "text-[#00D5BE]" : "text-teal-600",
            )}
          >
            {voucher.initial}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            suppressHydrationWarning
            className={cn(
              "text-lg font-bold",
              mounted && theme === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            {voucher.code}
          </span>
          <span
            suppressHydrationWarning
            className={cn(
              "text-sm",
              mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
            )}
          >
            {voucher.plan}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span
            suppressHydrationWarning
            className={cn(
              "text-xs",
              mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
            )}
          >
            Date Issued
          </span>
          <span
            suppressHydrationWarning
            className={cn(
              "text-sm",
              mounted && theme === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            {voucher.dateIssued}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            suppressHydrationWarning
            className={cn(
              "text-xs",
              mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
            )}
          >
            Expiry Date
          </span>
          <span
            suppressHydrationWarning
            className={cn(
              "text-sm",
              mounted && theme === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            {voucher.expiryDate}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            suppressHydrationWarning
            className={cn(
              "text-xs",
              mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
            )}
          >
            Data Left
          </span>
          <span
            suppressHydrationWarning
            className="text-sm font-normal"
            style={{ color: voucher.dataLeftColor }}
          >
            {voucher.dataLeft}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <span
          suppressHydrationWarning
          className={cn(
            "px-3 py-1 rounded-full text-xs",
            mounted && theme === "dark"
              ? "bg-[#0D542B]/30 text-[#7BF1A8]"
              : "bg-green-100 text-green-700",
          )}
        >
          {voucher.status}
        </span>
        <button
          suppressHydrationWarning
          className={cn(
            "p-2 rounded-lg transition-colors",
            mounted && theme === "dark"
              ? "text-[#90A1B9] hover:bg-[#314158] hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          <MoreHorizontal size={20} />
        </button>
        <button
          suppressHydrationWarning
          className={cn(
            "p-2 rounded-lg transition-colors",
            mounted && theme === "dark"
              ? "text-[#90A1B9] hover:bg-[#314158] hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          <Copy size={20} />
        </button>
      </div>
    </div>
  );
}

export function VendorVouchers() {
  const { theme, mounted } = useTheme();
  const [vouchers] = useState<Voucher[]>(vouchersData);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    status: "Active",
    plan: "",
    issuedAfter: "",
    expiresBefore: "",
    minDataLeft: "0.0",
  });

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-full p-4 lg:p-6",
        mounted && theme === "dark" ? "bg-[#1E293B]" : "bg-slate-50",
      )}
    >
      <div className="w-full flex flex-col gap-6">
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
              Vouchers Overview
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
              View and manage your data plan vouchers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              suppressHydrationWarning
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-[10px] text-base transition-colors",
                mounted && theme === "dark"
                  ? "bg-[#00BBA7] text-white hover:bg-[#00a395]"
                  : "bg-teal-500 text-white hover:bg-teal-600",
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
                  ? "bg-[#1D293D] text-[#E2E8F0] hover:bg-[#314158]"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200",
              )}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            suppressHydrationWarning
            className={cn(
              "w-full p-6 rounded-[14px] flex flex-col gap-4",
              mounted && theme === "dark"
                ? "bg-[#1D293D] border border-[#314158]"
                : "bg-white border border-slate-200 shadow-md",
            )}
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h2
                suppressHydrationWarning
                className={cn(
                  "text-lg font-bold",
                  mounted && theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                Filter Vouchers
              </h2>
              <button
                suppressHydrationWarning
                onClick={() =>
                  setFilters({
                    status: "Active",
                    plan: "",
                    issuedAfter: "",
                    expiresBefore: "",
                    minDataLeft: "0.0",
                  })
                }
                className="text-sm text-[#00BBA7] hover:text-[#00d5c7] transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Filter Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="flex flex-col gap-2">
                <label
                  suppressHydrationWarning
                  className={cn(
                    "text-sm",
                    mounted && theme === "dark"
                      ? "text-[#CAD5E2]"
                      : "text-slate-600",
                  )}
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    suppressHydrationWarning
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className={cn(
                      "w-full h-10 px-3 pr-10 rounded-[10px] text-sm outline-none appearance-none cursor-pointer",
                      mounted && theme === "dark"
                        ? "bg-[#314158] text-white border border-[#45556C]"
                        : "bg-slate-100 text-slate-900 border border-slate-300",
                    )}
                  >
                    <option value="Active">Active Only</option>
                    <option value="">All Status</option>
                    <option value="Expired">Expired</option>
                    <option value="Used">Used</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                      mounted && theme === "dark"
                        ? "text-white"
                        : "text-slate-600",
                    )}
                  />
                </div>
              </div>

              {/* Service / Plan */}
              <div className="flex flex-col gap-2">
                <label
                  suppressHydrationWarning
                  className={cn(
                    "text-sm",
                    mounted && theme === "dark"
                      ? "text-[#CAD5E2]"
                      : "text-slate-600",
                  )}
                >
                  Service / Plan
                </label>
                <div className="relative">
                  <select
                    suppressHydrationWarning
                    value={filters.plan}
                    onChange={(e) =>
                      setFilters({ ...filters, plan: e.target.value })
                    }
                    className={cn(
                      "w-full h-10 px-3 pr-10 rounded-[10px] text-sm outline-none appearance-none cursor-pointer",
                      mounted && theme === "dark"
                        ? "bg-[#314158] text-white border border-[#45556C]"
                        : "bg-slate-100 text-slate-900 border border-slate-300",
                    )}
                  >
                    <option value="">All Plans</option>
                    <option value="Basic">Basic Plan</option>
                    <option value="Standard">Standard Plan</option>
                    <option value="Premium">Premium Plan</option>
                    <option value="Unlimited">Unlimited Plan</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                      mounted && theme === "dark"
                        ? "text-white"
                        : "text-slate-600",
                    )}
                  />
                </div>
              </div>

              {/* Issued After */}
              <div className="flex flex-col gap-2">
                <label
                  suppressHydrationWarning
                  className={cn(
                    "text-sm",
                    mounted && theme === "dark"
                      ? "text-[#CAD5E2]"
                      : "text-slate-600",
                  )}
                >
                  Issued After
                </label>
                <input
                  suppressHydrationWarning
                  type="date"
                  value={filters.issuedAfter}
                  onChange={(e) =>
                    setFilters({ ...filters, issuedAfter: e.target.value })
                  }
                  className={cn(
                    "w-full h-10 px-3 rounded-[10px] text-sm outline-none",
                    mounted && theme === "dark"
                      ? "bg-[#314158] text-white border border-[#45556C]"
                      : "bg-slate-100 text-slate-900 border border-slate-300",
                  )}
                />
              </div>

              {/* Expires Before */}
              <div className="flex flex-col gap-2">
                <label
                  suppressHydrationWarning
                  className={cn(
                    "text-sm",
                    mounted && theme === "dark"
                      ? "text-[#CAD5E2]"
                      : "text-slate-600",
                  )}
                >
                  Expires Before
                </label>
                <input
                  suppressHydrationWarning
                  type="date"
                  value={filters.expiresBefore}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      expiresBefore: e.target.value,
                    })
                  }
                  className={cn(
                    "w-full h-10 px-3 rounded-[10px] text-sm outline-none",
                    mounted && theme === "dark"
                      ? "bg-[#314158] text-white border border-[#45556C]"
                      : "bg-slate-100 text-slate-900 border border-slate-300",
                  )}
                />
              </div>

              {/* Min Data Left */}
              <div className="flex flex-col gap-2">
                <label
                  suppressHydrationWarning
                  className={cn(
                    "text-sm",
                    mounted && theme === "dark"
                      ? "text-[#CAD5E2]"
                      : "text-slate-600",
                  )}
                >
                  Min Data Left (GB)
                </label>
                <input
                  suppressHydrationWarning
                  type="number"
                  step="0.1"
                  value={filters.minDataLeft}
                  onChange={(e) =>
                    setFilters({ ...filters, minDataLeft: e.target.value })
                  }
                  className={cn(
                    "w-full h-10 px-3 rounded-[10px] text-sm outline-none",
                    mounted && theme === "dark"
                      ? "bg-[#314158] text-white border border-[#45556C]"
                      : "bg-slate-100 text-slate-900 border border-slate-300",
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Count */}
        <p
          suppressHydrationWarning
          className={cn(
            "text-sm",
            mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
          )}
        >
          Showing 6 of 8 vouchers
        </p>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
              mounted={mounted}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
