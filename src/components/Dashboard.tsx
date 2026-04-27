"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Users,
  Wifi,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Layout } from "@/components/Layout";

const capacityData = [
  { name: "Used", value: 75, color: "#14B8A6" },
  { name: "Available", value: 25, color: "#E2E8F0" },
];

const sessionsData = [
  { id: 1, code: "****21BZ", plan: "Premium 5GB",  accessed: " 10:30:12 AM; 2023-12-10", remaining: 2.5, status: "Online" },
  { id: 2, code: "****02KQ", plan: "Basic 1GB",    accessed: "Not yet accessed", remaining: 1,  status: "Unused"   },
  { id: 3, code: "****21MP", plan: "Standard 2GB",  accessed: " 9:45:30 AM; 2023-12-01", remaining: 2,    status: "Online" },
  { id: 4, code: "****12RW", plan: "Giga 10GB", accessed: " 4:20:10 PM; 2023-11-28", remaining: 4.5,  status: "Online" },
  { id: 5, code: "****22TJ", plan: "Premium 5GB",  accessed: " 11:00:00 AM; 2023-12-15", remaining: 4, status: "Online" },
];

const STATUS_COLORS: Record<string, string> = {
  Online:          "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Used:            "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  Unused:          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Expiring Soon": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export function Dashboard() {
  const [filter, setFilter] = useState("all");

  const filteredSessions = sessionsData.filter((s) => {
    if (filter === "low_data")      return s.remaining < 5;
    if (filter === "expiring_soon") return s.status === "Expiring Soon";
    return true;
  });

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, Agent.</p>
          </div>
          <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
            System Status: Online
          </span>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Capacity donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Data Capacity</h3>
              <Database size={18} className="text-slate-400" />
            </div>
            <div className="relative flex items-center justify-center" style={{ height: 200 }}>
              <PieChart width={200} height={200}>
                <Pie data={capacityData} cx={100} cy={100} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {capacityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">75%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Used</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-medium text-teal-600 dark:text-teal-400">Used: 750 GB</p>
                <p>Avail: 250 GB</p>
              </div>
              <div className="text-right">
                <p className="text-orange-500">Expires</p>
                <p>Dec 31, 2023</p>
              </div>
            </div>
          </motion.div>

          {/* Quick stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Total Active Vouchers</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1,245</h3>
                </div>
                <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-teal-600 dark:text-teal-400">
                  <Users size={24} />
                </div>
              </div>
              {/* <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                <ArrowUpRight size={16} className="mr-1" />
                <span className="font-medium">12%</span>
                <span className="ml-1 text-slate-500 dark:text-slate-400">vs last month</span>
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Total Generated Voucher</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">2,000</h3>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                  <Wifi size={24} />
                </div>
              </div>
              {/* <div className="mt-4 flex items-center text-sm text-red-500 dark:text-red-400">
                <ArrowDownRight size={16} className="mr-1" />
                <span className="font-medium">3%</span>
                <span className="ml-1 text-slate-500 dark:text-slate-400">vs last month</span>
              </div> */}
            </motion.div>
          </div>
        </div>

        {/* Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Active Sessions</h3>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="all">All Sessions</option>
                <option value="low_data">Low Data (&lt; 5 GB)</option>
                <option value="expiring_soon">Expiring Soon</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-3 font-medium">Code</th>
                  
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Accessed</th>
                  <th className="px-6 py-3 font-medium">Remaining</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">{session.code}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{session.plan}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{session.accessed}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {session.remaining === 999 ? "∞" : `${session.remaining} GB`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", STATUS_COLORS[session.status] ?? "bg-slate-100 text-slate-600")}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSessions.length === 0 && (
              <p className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                No sessions match the current filter.
              </p>
            )}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}