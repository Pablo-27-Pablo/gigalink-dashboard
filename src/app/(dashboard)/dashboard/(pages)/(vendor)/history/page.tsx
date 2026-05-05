"use client";

import { useState, useMemo, useEffect } from "react"; // Added useEffect
import { motion } from "motion/react";
import {
  Download,
  Search,
  Filter,
  X,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "../../../../../../components/axios/axios"; // Adjust this import based on your project structure
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

// Updated interface to match your API response
interface ExpiredVoucher {
  id: number;
  username: string; // This is the "code"
  profileName: string; // This is the "planName"
  expiration: string | null;
  historyStatus: string;
  assignedAt: string;
  // ... add other fields if needed for logic
}

export default function History() {
  const [vouchers, setVouchers] = useState<ExpiredVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [filterCode, setFilterCode] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterReason, setFilterReason] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // --- API Fetching Logic ---
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      // Hardcoded ID '1' as per your endpoint requirement
      const sessionToken = Cookies.get("session2");
      const vendorID = Cookies.get("vendorId");
      axiosInstance
        .get(`api/seller/${vendorID}/voucher-history`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        })
        .then((res) => {
          setVouchers(res.data.vouchers || []);
          console.log("✅ Voucher History Data:", res.data); // Log the entire response for debugging
        })
        .catch((err) => {
          console.error("❌ History Fetch Error:", err);
          toast.error("Failed to load voucher history");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchHistory();
  }, []);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      if (
        filterCode &&
        !voucher.username.toLowerCase().includes(filterCode.toLowerCase())
      )
        return false;
      if (
        filterPlan !== "all" &&
        voucher.profileName.toLowerCase() !== filterPlan.toLowerCase()
      )
        return false;

      // Date filtering based on 'assignedAt' or 'expiration'
      const relevantDate = voucher.expiration?.split("T")[0];
      if (relevantDate) {
        if (filterDateFrom && relevantDate < filterDateFrom) return false;
        if (filterDateTo && relevantDate > filterDateTo) return false;
      }
      return true;
    });
  }, [vouchers, filterCode, filterPlan, filterDateFrom, filterDateTo]);

  const handleExport = () => {
    const headers = ["Voucher Code", "Plan Name", "Status", "Expiration"];
    const rows = filteredVouchers.map((v) => [
      v.username,
      v.profileName,
      v.historyStatus,
      v.expiration ?? "N/A",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `history-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    const isExpired = status === "expired";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
          isExpired
            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30"
            : "bg-teal-100 text-teal-700 dark:bg-teal-900/30",
        )}
      >
        {isExpired ? <Calendar size={12} /> : <AlertCircle size={12} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 mx-auto p-6 px-8">
      {/* Header same as before */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Voucher History
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            View all expired and used vouchers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              showFilters
                ? "bg-teal-500 text-white"
                : "bg-slate-100 dark:bg-slate-800",
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

      {/* Filters Panel remains mostly the same, ensuring 'plan' options match your API profileNames */}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">
            Loading history...
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No vouchers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3">Voucher Code</th>
                  <th className="px-6 py-3">Plan Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Expiration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map((voucher, index) => (
                  <motion.tr
                    key={voucher.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white font-mono">
                      {voucher.username}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {voucher.profileName}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(voucher.historyStatus)}
                    </td>
                    <td className="px-6 py-4">
                      {voucher.expiration
                        ? new Date(voucher.expiration).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
