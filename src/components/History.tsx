"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Download, Search, Filter, X, AlertCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";

interface ExpiredVoucher {
  code: string;
  planName: string;
  expiredDate: string | null;
  dataExhausted: boolean;
  exhaustedDate: string | null;
  reason: "expired" | "exhausted" | "both";
}

const expiredVouchersData: ExpiredVoucher[] = [
  { code: "VCH-BAS-005", planName: "Basic",     expiredDate: "2024-01-01", dataExhausted: false, exhaustedDate: null,         reason: "expired"   },
  { code: "VCH-PRE-007", planName: "Premium",   expiredDate: "2024-02-15", dataExhausted: false, exhaustedDate: null,         reason: "expired"   },
  { code: "VCH-STD-009", planName: "Standard",  expiredDate: null,         dataExhausted: true,  exhaustedDate: "2024-02-10", reason: "exhausted" },
  { code: "VCH-BAS-010", planName: "Basic",     expiredDate: null,         dataExhausted: true,  exhaustedDate: "2024-01-25", reason: "exhausted" },
  { code: "VCH-UNL-011", planName: "Unlimited", expiredDate: "2024-01-20", dataExhausted: false, exhaustedDate: null,         reason: "expired"   },
  { code: "VCH-STD-012", planName: "Standard",  expiredDate: null,         dataExhausted: true,  exhaustedDate: "2024-02-05", reason: "exhausted" },
  { code: "VCH-PRE-013", planName: "Premium",   expiredDate: "2024-01-15", dataExhausted: true,  exhaustedDate: "2024-01-10", reason: "both"      },
  { code: "VCH-BAS-014", planName: "Basic",     expiredDate: "2023-12-31", dataExhausted: false, exhaustedDate: null,         reason: "expired"   },
  { code: "VCH-STD-015", planName: "Standard",  expiredDate: null,         dataExhausted: true,  exhaustedDate: "2024-01-30", reason: "exhausted" },
  { code: "VCH-PRE-016", planName: "Premium",   expiredDate: "2024-02-01", dataExhausted: false, exhaustedDate: null,         reason: "expired"   },
];

export function History() {
  const [showFilters, setShowFilters] = useState(false);
  const [filterCode, setFilterCode] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const filteredVouchers = useMemo(() => {
    return expiredVouchersData.filter((voucher) => {
      if (filterCode && !voucher.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
      if (filterPlan !== "all" && voucher.planName.toLowerCase() !== filterPlan.toLowerCase()) return false;
      if (filterReason !== "all") {
        if (filterReason === "expired"   && voucher.reason !== "expired"   && voucher.reason !== "both") return false;
        if (filterReason === "exhausted" && voucher.reason !== "exhausted" && voucher.reason !== "both") return false;
      }
      const relevantDate = voucher.dataExhausted ? voucher.exhaustedDate : voucher.expiredDate;
      if (relevantDate) {
        if (filterDateFrom && relevantDate < filterDateFrom) return false;
        if (filterDateTo   && relevantDate > filterDateTo)   return false;
      }
      return true;
    });
  }, [filterCode, filterPlan, filterReason, filterDateFrom, filterDateTo]);

  const resetFilters = () => {
    setFilterCode(""); setFilterPlan("all"); setFilterReason("all");
    setFilterDateFrom(""); setFilterDateTo("");
  };

  const handleExport = () => {
    const headers = ["Voucher Code", "Plan Name", "Status", "Date"];
    const rows = filteredVouchers.map((v) => {
      const status = v.reason === "expired" ? "Expired" : v.reason === "exhausted" ? "Data Exhausted" : "Expired & Exhausted";
      const date = v.dataExhausted ? v.exhaustedDate : v.expiredDate;
      return [v.code, v.planName, status, date ?? "N/A"];
    });
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `voucher-history-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (voucher: ExpiredVoucher) => {
    if (voucher.reason === "expired") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
        <Calendar size={12} /> Expired
      </span>
    );
    if (voucher.reason === "exhausted") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <AlertCircle size={12} /> Data Exhausted
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
        <AlertCircle size={12} /> Expired & Exhausted
      </span>
    );
  };

  const getRelevantDate = (voucher: ExpiredVoucher) => {
    if (voucher.reason === "both") return `Expired: ${voucher.expiredDate}, Exhausted: ${voucher.exhaustedDate}`;
    return voucher.dataExhausted ? voucher.exhaustedDate : voucher.expiredDate;
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voucher History</h1>
            <p className="text-slate-500 dark:text-slate-400">View all expired and used vouchers.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                showFilters
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <Filter size={16} /> Filters
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Filter Vouchers</h3>
              <button onClick={resetFilters} className="text-sm text-teal-500 hover:text-teal-600 transition-colors">
                Reset All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Voucher Code</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" value={filterCode} onChange={(e) => setFilterCode(e.target.value)}
                    placeholder="Search code..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {filterCode && (
                    <button onClick={() => setFilterCode("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Plan Name</label>
                <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="all">All Plans</option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status Reason</label>
                <select value={filterReason} onChange={(e) => setFilterReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="all">All Reasons</option>
                  <option value="expired">Expired</option>
                  <option value="exhausted">Data Exhausted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date From</label>
                <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date To</label>
                <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredVouchers.length} of {expiredVouchersData.length} expired/used vouchers
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {filteredVouchers.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No vouchers found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3">Voucher Code</th>
                    <th className="px-6 py-3">Plan Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((voucher, index) => (
                    <motion.tr
                      key={voucher.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white font-mono">{voucher.code}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{voucher.planName}</td>
                      <td className="px-6 py-4">{getStatusBadge(voucher)}</td>
                      <td className="px-6 py-4">{getRelevantDate(voucher)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}