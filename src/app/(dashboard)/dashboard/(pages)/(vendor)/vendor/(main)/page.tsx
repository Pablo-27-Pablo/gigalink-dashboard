"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, Wifi, Ticket, Search } from "lucide-react";
import { cn } from "@/lib/utils";
//import axiosInstance from "../../component-dashboard/axios/axios";
import Link from "next/link";

// --- Interfaces ---
interface Batch {
  batch_id: number;
  batch_name: string;
  batch_description: string;
  creationdate: string;
  owner: string;
  vouchers: {
    username: string;
    password: string;
    batch_id: number;
    status: string;
  }[];
}

const getPlanDisplayName = (desc: string) => {
  if (desc.includes("Basic")) return "Basic Plan";
  if (desc.includes("Medium")) return "Medium Plan";
  if (desc.includes("Giga")) return "Giga Plan";
  return "Standard Plan";
};

export default function Dashboard() {
  const [showAll, setShowAll] = useState(false);
  //const [batchGroup, setBatchGroup] = useState<Batch[]>([]);
  const [filterStatus] = useState<string>("online");
  const [batchGroup, setBatchGroup] = useState<Batch[]>([
    {
      batch_id: 1,
      batch_name: "Morning Batch",
      batch_description: "10GB for 30 Days Giga Plan",
      creationdate: new Date().toISOString(),
      owner: "admin",
      vouchers: [
        {
          username: "USER-9921",
          password: "pw",
          batch_id: 1,
          status: "online",
        },
        {
          username: "USER-4432",
          password: "pw",
          batch_id: 1,
          status: "online",
        },
      ],
    },
    {
      batch_id: 2,
      batch_name: "Basic Promo",
      batch_description: "1GB for 1 Day Basic Plan",
      creationdate: new Date().toISOString(),
      owner: "admin",
      vouchers: [
        {
          username: "WIFI-7788",
          password: "pw",
          batch_id: 2,
          status: "online",
        },
        {
          username: "WIFI-1122",
          password: "pw",
          batch_id: 2,
          status: "unused",
        },
      ],
    },
  ]);

  useEffect(() => {
    const fetchData = () => {
      //   const token = localStorage.getItem("Authorization");
      //   axiosInstance
      //     .get<Batch[]>("/api/vouchers/", {
      //       headers: { Authorization: `Bearer ${token}` },
      //     })
      //     .then((response) => setBatchGroup(response.data))
      //     .catch((error) => console.error("Error fetching batches:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const vouchersData = useMemo(() => {
    return batchGroup.flatMap((batch) =>
      batch.vouchers.map((v) => ({
        code: v.username,
        servicePlan: getPlanDisplayName(batch.batch_description),
        dateIssued: new Date(batch.creationdate).toLocaleDateString(),
        expiryDate: batch.batch_description.split("for ")[1] || "N/A",
        dataLeft: parseFloat(batch.batch_description.split("GB")[0]) || 0,
        status: v.status,
      })),
    );
  }, [batchGroup]);

  const filteredVouchers = useMemo(() => {
    return vouchersData.filter((v) => v.status.toLowerCase() === filterStatus);
  }, [vouchersData, filterStatus]);

  const stats = {
    total: vouchersData.length,
    online: vouchersData.filter((v) => v.status.toLowerCase() === "online")
      .length,
    unused: vouchersData.filter((v) => v.status.toLowerCase() === "unused")
      .length,
  };

  const formatData = (gb: number) => {
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(gb * 1024).toFixed(0)} MB`;
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
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
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Status: Online
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Vouchers",
            value: stats.total,
            icon: Wifi,
            color: "blue",
            tag: "Global",
            href: "/dashboard/history", // Added href
          },
          {
            label: "Online Now",
            value: stats.online,
            icon: Users,
            color: "teal",
            tag: "Live",
            href: "/online", // Added href
          },
          {
            label: "Stock Available",
            value: stats.unused,
            icon: Ticket,
            color: "slate",
            tag: "Stock",
            href: "/dashboard/services", // Added href
          },
        ].map((stat, i) => (
          <Link href={stat.href} key={i}>
            {" "}
            {/* Wrapped in Link */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl transition-transform group-hover:scale-110",
                    stat.color === "blue"
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                      : stat.color === "teal"
                        ? "bg-teal-50 dark:bg-teal-500/10 text-teal-600"
                        : "bg-slate-50 dark:bg-slate-500/10 text-slate-600",
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
            Online Sessions
            <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 rounded-md">
              {filteredVouchers.length}
            </span>
          </h2>
        </div>

        {/* List Header - Desktop Only */}
        {/* <div className="px-4 flex flex-1 flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-0 lg:justify-between border-t lg:border-t-0 border-slate-100 dark:border-slate-700/50 pt-4 lg:pt-0">
          <div className="col-span-2">Voucher</div>
          <div className="flex justify-evenly w-full itemsl-center ">
            <div>Plan</div>

            <div>Expiration</div>
            <div>Expiration</div>
            <div>Data Limit</div>
          </div>
          <div className="text-right">Status</div>
        </div> */}

        {/* Vouchers List */}
        {/* Vouchers List */}
        <div className="space-y-4">
          {filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No active online sessions found.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {filteredVouchers
                  .slice(0, showAll ? undefined : 5)
                  .map((voucher, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex  lg:flex-row lg:items-center gap-6">
                        {/* 1. Primary Info: Icon & Code */}
                        <div className="flex items-center gap-4 lg:w-1/4 group cursor-pointer">
                          {/* Icon Container */}
                          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-110 transition-transform">
                            <Ticket size={24} strokeWidth={2.5} />
                          </div>

                          <div className="min-w-0 relative h-10 flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                              Voucher Code
                            </p>

                            <div className="relative">
                              {/* Masked Code (Visible by default) */}
                              <h4 className="font-mono font-bold text-lg text-slate-800 dark:text-white leading-none transition-all duration-200 group-hover:opacity-0 group-hover:-translate-y-1">
                                ••••{voucher.code.slice(-4)}
                              </h4>

                              {/* Full Code (Visible on hover) */}
                              <h4 className="absolute inset-0 font-mono font-bold text-lg text-teal-600 dark:text-teal-400 leading-none opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                                {voucher.code}
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* 2. Secondary Info: Plan & Data */}
                        {/* Meta Data Section - Now fully Flexbox */}
                        <div className="flex flex-1 flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-0 lg:justify-between border-t lg:border-t-0 border-slate-100 dark:border-slate-700/50 pt-4 lg:pt-0">
                          {/* Plan Item */}
                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[10px]  text-slate-400 font-bold uppercase tracking-tight mb-1">
                              Plan
                            </span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              {voucher.servicePlan}
                            </span>
                          </div>

                          {/* Issued Item */}
                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[10px]  text-slate-400 font-bold uppercase tracking-tight mb-1">
                              Valid From
                            </span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              3/10/2026
                            </span>
                          </div>

                          {/* Expiry Item */}
                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[10px]  text-slate-400 font-bold uppercase tracking-tight mb-1">
                              Valid Until
                            </span>
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              3/13/2026
                            </span>
                          </div>

                          {/* Limit Item */}
                          <div className="flex flex-col min-w-[80px]">
                            <span className="text-[10px]  text-slate-400 font-bold uppercase tracking-tight mb-1">
                              Limit
                            </span>
                            <span className="font-bold text-orange-500">
                              {formatData(voucher.dataLeft)}
                            </span>
                          </div>
                        </div>

                        {/* 3. Status Action */}
                        <div className="flex  lg:block items-center justify-between mt-2 lg:mt-0">
                          <div className="text-[10px]  text-slate-400 font-bold uppercase tracking-tight mb-1">
                            Status
                          </div>

                          <span
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border",
                              "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
                            )}
                          >
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
                  className="w-full mt-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-teal-600 transition-all"
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
