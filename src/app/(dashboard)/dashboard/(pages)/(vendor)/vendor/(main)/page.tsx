"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, Wifi, Ticket, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Cookies from "js-cookie";
import axiosInstance from "../../.../../../../../../../components/axios/axios";
import { toast } from "sonner";

// --- New Interfaces ---
interface Voucher {
  voucherId: number;
  username: string;
  profileName: string;
  expiration: string | null;
  usedBytes: number;
  totalBytes: number;
  remainingBytes: number;
  status: string;
  assignedAt: string;
}

interface DashboardData {
  sellerId: number;
  distributorId: number;
  lastSyncedAt: string;
  vouchers: Voucher[];
}

export default function Dashboard() {
  const [showAll, setShowAll] = useState(false);
  const [totalVouchers, setTotalVouchers] = useState("0");
  const [stockAvailable, setStockAvailable] = useState("0");
  const [activatedCount, setActivatedCount] = useState("0");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Replaced batchGroup with a flat vouchers array
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [filterStatus] = useState<string>("active"); // Changed to match your JSON data "inactive" or "unused"

  useEffect(() => {
    fetchData();
    fetchActivatedActive(); // Fetch activated count separately to ensure it updates in real-time
    // Set interval to repeat every 5 seconds
  }, []);

  const fetchData = () => {
    const sessionToken = Cookies.get("session2");
    const sessionSellerId = Cookies.get("vendorId");

    axiosInstance
      .get(`api/seller/${sessionSellerId}/dashboard`, {
        headers: {
          ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        },
      })
      .then((res) => {
        // Update Totals
        setTotalVouchers(res.data.totals.assignedVouchers);
        setStockAvailable(res.data.totals.remainingVouchers);
        setActivatedCount(res.data.totals.activatedVouchers);
        console.log("✅ Totals:", res.data.totals);

        // Update flat Vouchers list
        // res.data.vouchers should match the new array structure
        setVouchers(res.data.vouchers || []);
        console.log("✅ Dashboard Data:", res.data.vouchers);
      })
      .catch((err) => {
        console.error("❌ Dashboard Fetch Error:", err);
        toast.error("Failed to load dashboard data");
      });
  };
  const fetchActivatedActive = (showToast = false) => {
    const sessionToken = Cookies.get("session2");
    const sessionSellerId = Cookies.get("vendorId");

    if (showToast) {
      setIsRefreshing(true);
    }

    axiosInstance
      .post(
        `api/seller/${sessionSellerId}/active-vouchers/refresh`,
        {},
        {
          headers: {
            ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
          },
        },
      )
      .then((res) => {
        setVouchers(res.data.vouchers);
        console.log("✅ Activated Vouchers:", res.data.vouchers);
        if (showToast) {
          toast.success("Voucher sessions refreshed");
        }
      })
      .catch((err) => {
        console.error("❌ Activated Active Fetch Error:", err);
        if (showToast) {
          toast.error("Failed to refresh voucher sessions");
        }
      })
      .finally(() => {
        if (showToast) {
          setIsRefreshing(false);
        }
      });
  };

  // Simplified: No more .flatMap() needed since data is already flat
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(
      (v) => v.status.toLowerCase() === filterStatus.toLowerCase(),
    );
  }, [vouchers, filterStatus]);

  const formatData = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);

    return gb >= 1
      ? `${gb.toFixed(2)} GB` // Changed from .toFixed(1)
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`; // Changed from .toFixed(0)
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header & Stat Cards (Same as before, using updated state) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time voucher monitoring and system status.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm text-sm font-semibold">
          System Status: Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Vouchers",
            value: totalVouchers,
            icon: Wifi,
            color: "blue",
            tag: "Global",
            href: "/dashboard/history",
          },
          {
            label: "Online Now",
            value: activatedCount,
            icon: Users,
            color: "teal",
            tag: "Live",
            href: "/online",
          },
          {
            label: "Stock Available",
            value: stockAvailable,
            icon: Ticket,
            color: "slate",
            tag: "Stock",
            href: "/dashboard/services",
          },
        ].map((stat, i) => (
          <Link href={stat.href} key={i}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    stat.color === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : stat.color === "teal"
                        ? "bg-teal-50 text-teal-600"
                        : "bg-slate-50 text-slate-600",
                  )}
                >
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {stat.tag}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.value}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Voucher Sessions
            <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-md">
              {filteredVouchers.length}
            </span>
          </h2>
          <button
            onClick={() => fetchActivatedActive(true)}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50"
            title="Refresh Sessions"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </button>
        </div>

        <div className="space-y-4">
          {filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Search className="h-8 w-8 text-slate-400 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No vouchers found for current filter.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {filteredVouchers
                  .slice(0, showAll ? undefined : 5)
                  .map((voucher) => (
                    <div
                      key={voucher.voucherId}
                      className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 transition-all"
                    >
                      <div className="flex lg:flex-row lg:items-center gap-6">
                        <div className="flex items-center gap-4 lg:w-1/4">
                          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600">
                            <Ticket size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              Voucher Code
                            </p>
                            <h4 className="font-mono font-bold text-lg text-slate-800 dark:text-white">
                              {voucher.username}
                            </h4>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-wrap lg:flex-nowrap items-center gap-6 lg:justify-between">
                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Plan
                            </span>
                            <span className="font-medium">
                              {voucher.profileName}
                            </span>
                          </div>

                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Assigned At
                            </span>
                            <span className="font-medium">
                              {new Date(
                                voucher.assignedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Assigned At
                            </span>
                            <span className="font-medium">
                              {new Date(
                                voucher.expiration || "",
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex flex-col min-w-[80px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Remaining
                            </span>
                            <span className="font-bold text-orange-500">
                              {formatData(voucher.remainingBytes)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 lg:mt-0">
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {voucher.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {filteredVouchers.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full mt-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-500"
                >
                  {showAll
                    ? "Show Less"
                    : `View All ${filteredVouchers.length} Vouchers`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
