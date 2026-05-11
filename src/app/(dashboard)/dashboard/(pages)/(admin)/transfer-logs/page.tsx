"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Building2,
  Ticket,
  Calendar,
  Package,
  Loader2,
} from "lucide-react";
import Cookies from "js-cookie";
import axiosInstance from "../../../../../../components/axios/axios";
import { cn } from "@/lib/utils"; // Import your cn util
import { toast } from "sonner";

// --- TYPES & INTERFACES ---
interface AssignedBy {
  userId: number;
  email: string;
  label: string;
}

interface Assignment {
  transferId: number;
  distributorName: string;
  planName: string;
  quantityAssigned: number;
  assignedAt: string;
  assignedBy: AssignedBy;
}

interface StatItem {
  label: string;
  value: string | number;
  color: string;
}

export default function TransferLogs() {
  // --- STATE ---
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  // --- API FETCHING ---
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const sessionToken = Cookies.get("session2");

        const response = await axiosInstance.get(
          `api/superadmin/dashboard/transfers/admin-to-distributors`,
          {
            headers: {
              ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
            },
          },
        );

        const incomingData = Array.isArray(response.data?.history)
          ? response.data.history
          : Array.isArray(response.data?.assignments)
            ? response.data.assignments
            : [];

        setAssignments(incomingData);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        toast.error("Failed to load transfer logs");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // --- DERIVED VALUES ---
  const totalVouchers = useMemo(
    () =>
      assignments.reduce((sum, item) => sum + (item.quantityAssigned || 0), 0),
    [assignments],
  );

  const uniqueDistributors = useMemo(
    () => new Set(assignments.map((a) => a.distributorName)).size,
    [assignments],
  );

  const recentAssignments = useMemo(() => {
    return [...assignments]
      .sort(
        (a, b) =>
          new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
      )
      .slice(0, 5);
  }, [assignments]);

  // --- STATS ---
  const stats: StatItem[] = [
    {
      label: "Total Vouchers",
      value: totalVouchers,
      color: "text-[#00adb5]",
    },
    {
      label: "Active Distributors",
      value: uniqueDistributors,
      color: "text-[#0f172a] dark:text-white",
    },
  ];

  // --- HELPERS ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- FILTERING ---
  const filteredAssignments = assignments
    .filter((item: Assignment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.distributorName?.toLowerCase().includes(searchLower) ||
        item.planName?.toLowerCase().includes(searchLower) ||
        (item.assignedBy?.label || "").toLowerCase().includes(searchLower)
      );
    })
    .filter((item: Assignment) => {
      if (filterType === "recent") {
        return recentAssignments.some(
          (recent) => recent.transferId === item.transferId,
        );
      }
      return true;
    });

  return (
    <div className={cn("min-h-screen p-8 transition-colors", "")}>
      {/* Header */}
      <div className="mb-8">
        <h1
          className={cn(
            "text-3xl font-bold tracking-tight text-[#0f172a]",
            "dark:text-white",
          )}
        >
          Assignment Logs
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor all voucher assignments to distributors
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-colors",
              "dark:bg-slate-900 dark:border-slate-800",
            )}
          >
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
              {stat.label}
            </p>
            <p className={cn("text-4xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div
        className={cn(
          "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center transition-colors",
          "dark:bg-slate-900 dark:border-slate-800",
        )}
      >
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by distributor, plan, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00adb5] transition-all",
              "dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:border-[#00adb5]",
            )}
          />
        </div>

        <div
          className={cn(
            "flex bg-slate-100 p-1 rounded-xl",
            "dark:bg-slate-800",
          )}
        >
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "px-5 py-1.5 rounded-lg font-medium text-sm transition-all",
              filterType === "all"
                ? "bg-[#00adb5] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700",
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("recent")}
            className={cn(
              "px-5 py-1.5 rounded-lg font-medium text-sm transition-all",
              filterType === "recent"
                ? "bg-[#00adb5] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700",
            )}
          >
            Recent
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div
        className={cn(
          "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-colors",
          "dark:bg-slate-900 dark:border-slate-800",
        )}
      >
        <div
          className={cn(
            "p-6 border-b border-slate-100 flex justify-between items-center",
            "dark:border-slate-800",
          )}
        >
          <h2
            className={cn(
              "text-xl font-bold text-slate-800",
              "dark:text-white",
            )}
          >
            {filterType === "recent" ? "Recent Assignments" : "All Assignments"}
          </h2>
          <span
            className={cn(
              "text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded",
              "dark:bg-slate-800 dark:text-slate-500",
            )}
          >
            {loading
              ? "Loading..."
              : `Showing ${filteredAssignments.length} results`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={cn(
                  "bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold",
                  "dark:bg-slate-800/30",
                )}
              >
                <th className="px-8 py-4">Distributor</th>
                <th className="px-8 py-4">Plan Name</th>
                <th className="px-8 py-4">Quantity</th>
                <th className="px-8 py-4">Assigned Date</th>
                <th className="px-8 py-4">Assigned By</th>
              </tr>
            </thead>

            <tbody
              className={cn(
                "divide-y divide-slate-100",
                "dark:divide-slate-800",
              )}
            >
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2
                        className="animate-spin text-[#00adb5]"
                        size={32}
                      />
                      <p>Fetching inventory data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-10 text-center text-slate-400"
                  >
                    No matching assignments found.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((row) => (
                  <tr
                    key={row.transferId}
                    className={cn(
                      "hover:bg-slate-50/30 transition-colors",
                      "dark:hover:bg-slate-800/30",
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-[#00adb5]",
                            "dark:bg-cyan-950/30",
                          )}
                        >
                          <Building2 size={20} />
                        </div>
                        <span
                          className={cn(
                            "font-semibold text-slate-700",
                            "dark:text-slate-200",
                          )}
                        >
                          {row.distributorName}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-[#00adb5] border border-cyan-100",
                          "dark:bg-cyan-950/30 dark:border-cyan-900/50",
                        )}
                      >
                        {row.planName}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div
                        className={cn(
                          "flex items-center gap-2 text-slate-700 font-medium",
                          "dark:text-slate-300",
                        )}
                      >
                        <Package size={16} className="text-slate-400" />
                        {row.quantityAssigned}
                      </div>
                    </td>

                    <td className="px-8 py-5 text-sm text-slate-500">
                      {formatDate(row.assignedAt)}
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-sm font-medium text-slate-700",
                            "dark:text-slate-200",
                          )}
                        >
                          {row.assignedBy?.label || "N/A"}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tight">
                          ID: {row.assignedBy?.userId || "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
