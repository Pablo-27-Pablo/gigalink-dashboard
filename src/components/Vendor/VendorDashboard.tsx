"use client";

import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  Users,
  Wifi,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Clock,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";

const capacityData = [
  { name: "Used", value: 75, color: "#14B8A6" },
  { name: "Available", value: 25, color: "#E2E8F0" },
];

const sessionsData = [
  {
    id: 1,
    code: "AX9921BZ",
    plan: "Premium 5 GB",
    status: "Online",
    remaining: 2.5,
    remainingPercent: 50,
    expiration: "2023-12-10",
  },
  {
    id: 2,
    code: "BZ1102KQ",
    plan: "Basic 1 GB",
    status: "Used",
    remaining: 0.002,
    remainingPercent: 5,
    expiration: "2023-11-25",
  },
  {
    id: 3,
    code: "UL3321MP",
    plan: "Basic 1 GB",
    status: "Unused",
    remaining: 1,
    remainingPercent: 100,
    expiration: "2023-12-01",
  },
  {
    id: 4,
    code: "ST4412RW",
    plan: "Standard 2 GB",
    status: "Online",
    remaining: 0.002,
    remainingPercent: 5,
    expiration: "2023-11-28",
  },
  {
    id: 5,
    code: "AX9922TJ",
    plan: "Premium 5 GB",
    status: "Online",
    remaining: 4,
    remainingPercent: 80,
    expiration: "2023-12-15",
  },
];

const STATUS_CONFIG = (
  theme: "light" | "dark",
  mounted: boolean,
): Record<string, { bg: string; dot: string; text: string }> => ({
  Online: {
    bg: mounted && theme === "dark" ? "bg-[#0D542B]/30" : "bg-green-100",
    dot: mounted && theme === "dark" ? "bg-[#00C950]" : "bg-green-500",
    text: mounted && theme === "dark" ? "text-[#7BF1A8]" : "text-green-700",
  },
  Used: {
    bg: mounted && theme === "dark" ? "bg-[#314158]" : "bg-slate-200",
    dot: mounted && theme === "dark" ? "bg-[#90A1B9]" : "bg-slate-400",
    text: mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-600",
  },
  Unused: {
    bg: mounted && theme === "dark" ? "bg-[#0B4F4A]/30" : "bg-teal-100",
    dot: mounted && theme === "dark" ? "bg-[#00BBA7]" : "bg-teal-500",
    text: mounted && theme === "dark" ? "text-[#46ECD5]" : "text-teal-700",
  },
});

const formatRemaining = (value: number) => {
  if (value < 0.01) return `${Math.round(value * 1000)} MB`;
  return `${value} GB`;
};

export function VendorDashboard() {
  const [filter, setFilter] = useState("all");
  const { theme, mounted } = useTheme();
  const statusConfig = STATUS_CONFIG(theme, mounted);

  const filteredSessions = sessionsData.filter((s) => {
    if (filter === "online") return s.status === "Online";
    if (filter === "unused") return s.status === "Unused";
    if (filter === "used") return s.status === "Used";
    return true;
  });

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen p-4 lg:p-6 bg-slate-100">
        <div className="w-full space-y-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-screen p-4 lg:p-6",
        mounted && theme === "dark" ? "bg-[#1E293B]" : "bg-slate-100",
      )}
    >
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1
              suppressHydrationWarning
              className={cn(
                "text-[32px] font-extrabold leading-5",
                mounted && theme === "dark" ? "text-white" : "text-slate-900",
              )}
            >
              Dashboard
            </h1>
            <p
              suppressHydrationWarning
              className={cn(
                "text-base font-normal mt-2",
                mounted && theme === "dark"
                  ? "text-[#90A1B9]"
                  : "text-slate-600",
              )}
            >
              Welcome back, John Doe!
            </p>
          </div>
          <div
            suppressHydrationWarning
            className={cn(
              "px-3 py-1.5 rounded-full",
              mounted && theme === "dark" ? "bg-[#0B4F4A]/30" : "bg-teal-100",
            )}
          >
            <span
              suppressHydrationWarning
              className={cn(
                "text-sm font-normal",
                mounted && theme === "dark"
                  ? "text-[#46ECD5]"
                  : "text-teal-700",
              )}
            >
              System Status: Online
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Capacity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "rounded-[14px] border p-6 shadow-sm",
              mounted && theme === "dark"
                ? "bg-[#1D293D] border-[#314158]"
                : "bg-white border-slate-200",
            )}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                suppressHydrationWarning
                className={cn(
                  "text-lg font-bold",
                  mounted && theme === "dark"
                    ? "text-[#E2E8F0]"
                    : "text-slate-800",
                )}
              >
                Data Capacity Overview
              </h3>
              <Layers
                size={20}
                className={cn(
                  mounted && theme === "dark"
                    ? "text-[#90A1B9]"
                    : "text-slate-400",
                )}
              />
            </div>

            <div className="relative flex items-center justify-center h-[200px]">
              <PieChart width={200} height={200}>
                <Pie
                  data={capacityData}
                  cx={100}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {capacityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                  suppressHydrationWarning
                  className={cn(
                    "text-2xl font-bold",
                    mounted && theme === "dark"
                      ? "text-white"
                      : "text-slate-900",
                  )}
                >
                  75%
                </span>
                <span
                  suppressHydrationWarning
                  className={cn(
                    "text-xs",
                    mounted && theme === "dark"
                      ? "text-[#90A1B9]"
                      : "text-slate-500",
                  )}
                >
                  Used
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                <p
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-bold",
                    mounted && theme === "dark"
                      ? "text-[#00D5BE]"
                      : "text-teal-600",
                  )}
                >
                  Used: 750 GB
                </p>
                <p
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-bold",
                    mounted && theme === "dark"
                      ? "text-[#90A1B9]"
                      : "text-slate-600",
                  )}
                >
                  Avail: 250 GB
                </p>
              </div>
              <div className="text-right">
                <p
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-bold",
                    mounted && theme === "dark"
                      ? "text-[#FF6900]"
                      : "text-orange-500",
                  )}
                >
                  Expires
                </p>
                <p
                  suppressHydrationWarning
                  className={cn(
                    "text-sm font-normal",
                    mounted && theme === "dark"
                      ? "text-[#90A1B9]"
                      : "text-slate-600",
                  )}
                >
                  Dec 31, 2023
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Two stacked cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Active Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={cn(
                "rounded-[14px] border p-6 shadow-sm flex flex-col justify-between",
                mounted && theme === "dark"
                  ? "bg-[#1D293D] border-[#314158]"
                  : "bg-white border-slate-200",
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-sm font-normal",
                      mounted && theme === "dark"
                        ? "text-[#90A1B9]"
                        : "text-slate-600",
                    )}
                  >
                    Active Sessions
                  </p>
                  <h3
                    suppressHydrationWarning
                    className={cn(
                      "text-[30px] font-bold mt-1",
                      mounted && theme === "dark"
                        ? "text-white"
                        : "text-slate-900",
                    )}
                  >
                    1,245
                  </h3>
                </div>
                <div
                  suppressHydrationWarning
                  className={cn(
                    "p-2 rounded-[10px]",
                    mounted && theme === "dark"
                      ? "bg-[#0B4F4A]/20 text-[#00D5BE]"
                      : "bg-teal-100 text-teal-600",
                  )}
                >
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <ArrowUpRight
                  size={16}
                  className={cn(
                    mounted && theme === "dark"
                      ? "text-[#05DF72]"
                      : "text-green-600",
                  )}
                />
                <span
                  className={cn(
                    "font-normal",
                    mounted && theme === "dark"
                      ? "text-[#05DF72]"
                      : "text-green-600",
                  )}
                >
                  12%
                </span>
                <span
                  className={cn(
                    "font-normal",
                    mounted && theme === "dark"
                      ? "text-[#90A1B9]"
                      : "text-slate-600",
                  )}
                >
                  vs last month
                </span>
              </div>
            </motion.div>

            {/* Avg Data Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={cn(
                "rounded-[14px] border p-6 shadow-sm flex flex-col justify-between",
                mounted && theme === "dark"
                  ? "bg-[#1D293D] border-[#314158]"
                  : "bg-white border-slate-200",
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className={cn(
                      "text-sm font-normal",
                      mounted && theme === "dark"
                        ? "text-[#90A1B9]"
                        : "text-slate-600",
                    )}
                  >
                    Avg. Data Usage
                  </p>
                  <h3
                    className={cn(
                      "text-[30px] font-bold mt-1",
                      mounted && theme === "dark"
                        ? "text-white"
                        : "text-slate-900",
                    )}
                  >
                    4.2 GB
                  </h3>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-[10px]",
                    mounted && theme === "dark"
                      ? "bg-[#1C398E]/20 text-[#51A2FF]"
                      : "bg-blue-100 text-blue-600",
                  )}
                >
                  <Wifi size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <ArrowDownRight
                  size={16}
                  className={cn(
                    mounted && theme === "dark"
                      ? "text-[#FF6467]"
                      : "text-red-500",
                  )}
                />
                <span
                  className={cn(
                    "font-normal",
                    mounted && theme === "dark"
                      ? "text-[#FF6467]"
                      : "text-red-500",
                  )}
                >
                  3%
                </span>
                <span
                  className={cn(
                    "font-normal",
                    mounted && theme === "dark"
                      ? "text-[#90A1B9]"
                      : "text-slate-600",
                  )}
                >
                  vs last month
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Active Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={cn(
            "rounded-[14px] border shadow-sm overflow-hidden",
            mounted && theme === "dark"
              ? "bg-[#1D293D] border-[#314158]"
              : "bg-white border-slate-200",
          )}
        >
          <div
            className={cn(
              "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-6 py-4 border-b",
              mounted && theme === "dark"
                ? "border-[#314158]"
                : "border-slate-200",
            )}
          >
            <h3
              className={cn(
                "text-lg font-bold",
                mounted && theme === "dark" ? "text-white" : "text-slate-900",
              )}
            >
              Active Sessions
            </h3>
            <div className="flex items-center gap-2">
              <Filter
                size={16}
                className={cn(
                  mounted && theme === "dark"
                    ? "text-[#90A1B9]"
                    : "text-slate-400",
                )}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={cn(
                  "text-sm rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00D5BE]",
                  mounted && theme === "dark"
                    ? "bg-[#0F172B] border border-[#45556C] text-white"
                    : "bg-slate-50 border border-slate-300 text-slate-900",
                )}
              >
                <option value="all">All</option>
                <option value="online">Online</option>
                <option value="unused">Unused</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={cn(
                    mounted && theme === "dark"
                      ? "bg-[#0F172B]/50"
                      : "bg-slate-100",
                  )}
                >
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider",
                      mounted && theme === "dark"
                        ? "text-[#CAD5E2]"
                        : "text-slate-600",
                    )}
                  >
                    Voucher Code
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider",
                      mounted && theme === "dark"
                        ? "text-[#CAD5E2]"
                        : "text-slate-600",
                    )}
                  >
                    Data Plan
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider",
                      mounted && theme === "dark"
                        ? "text-[#CAD5E2]"
                        : "text-slate-600",
                    )}
                  >
                    Status
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider",
                      mounted && theme === "dark"
                        ? "text-[#CAD5E2]"
                        : "text-slate-600",
                    )}
                  >
                    Remaining
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider",
                      mounted && theme === "dark"
                        ? "text-[#CAD5E2]"
                        : "text-slate-600",
                    )}
                  >
                    Expiration
                  </th>
                  <th
                    className={cn(
                      "px-6 py-3 text-center text-xs font-bold uppercase tracking-wider",
                      mounted && theme === "dark"
                        ? "text-[#CAD5E2]"
                        : "text-slate-600",
                    )}
                  >
                    QR Code
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn(
                  "divide-y",
                  mounted && theme === "dark"
                    ? "divide-[#314158]"
                    : "divide-slate-200",
                )}
              >
                {filteredSessions.map((session) => {
                  const statusStyle = statusConfig[session.status];
                  const barColor =
                    session.remainingPercent < 10
                      ? "bg-[#FB2C36]"
                      : "bg-[#00BBA7]";

                  return (
                    <tr
                      key={session.id}
                      className={cn(
                        "transition-colors",
                        mounted && theme === "dark"
                          ? "hover:bg-[#0F172B]/30"
                          : "hover:bg-slate-50",
                      )}
                    >
                      <td
                        className={cn(
                          "px-6 py-4 font-mono font-bold tracking-wider",
                          mounted && theme === "dark"
                            ? "text-white"
                            : "text-slate-900",
                        )}
                      >
                        {session.code}
                      </td>
                      <td
                        className={cn(
                          "px-6 py-4",
                          mounted && theme === "dark"
                            ? "text-[#90A1B9]"
                            : "text-slate-600",
                        )}
                      >
                        {session.plan}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
                            statusStyle.bg,
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              statusStyle.dot,
                            )}
                          />
                          <span className={statusStyle.text}>
                            {session.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-16 h-2 rounded-full overflow-hidden",
                              mounted && theme === "dark"
                                ? "bg-[#45556C]"
                                : "bg-slate-300",
                            )}
                          >
                            <div
                              className={cn("h-full rounded-full", barColor)}
                              style={{ width: `${session.remainingPercent}%` }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-mono",
                              mounted && theme === "dark"
                                ? "text-[#90A1B9]"
                                : "text-slate-600",
                            )}
                          >
                            {formatRemaining(session.remaining)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            mounted && theme === "dark"
                              ? "text-[#90A1B9]"
                              : "text-slate-600",
                          )}
                        >
                          <Clock size={14} />
                          <span>{session.expiration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-colors",
                            mounted && theme === "dark"
                              ? "bg-[#0B4F4A]/20 text-[#00D5BE] hover:bg-[#0B4F4A]/40"
                              : "bg-teal-100 text-teal-700 hover:bg-teal-200",
                          )}
                        >
                          <QrCode size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredSessions.length === 0 && (
              <p
                className={cn(
                  "text-center py-10 text-sm",
                  mounted && theme === "dark"
                    ? "text-[#90A1B9]"
                    : "text-slate-600",
                )}
              >
                No sessions match the current filter.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
