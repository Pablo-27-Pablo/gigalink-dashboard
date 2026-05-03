"use client";

import { User, Mail, Phone, Lock, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming your cn util is here

export default function Profile() {
  return (
    <div className={cn("min-h-screen  transition-colors", "dark:bg-slate-950")}>
      <main className="max-w-4xl mx-auto pt-12 pb-20 px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1
            className={cn(
              "text-3xl font-bold text-[#0f172a]",
              "dark:text-white",
            )}
          >
            Profile Settings
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
            "dark:bg-slate-900 dark:border-slate-800",
          )}
        >
          {/* Cyan Header Section */}
          <div className="h-44 bg-[#00adb5] relative flex justify-center">
            <div className="absolute -bottom-14">
              <div
                className={cn(
                  "w-28 h-28 rounded-full border-4 border-white bg-[#f1f5f9] flex items-center justify-center text-slate-400",
                  "dark:border-slate-900 dark:bg-slate-800 dark:text-slate-500",
                )}
              >
                <User size={54} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-12 px-10">
            <h2
              className={cn(
                "text-2xl font-bold text-[#0f172a] text-center mb-12",
                "dark:text-white",
              )}
            >
              BARMM DISTRIBUTOR
            </h2>

            <div className="max-w-xl mx-auto space-y-8">
              {/* Email Row */}
              <div
                className={cn(
                  "flex items-center gap-5 pb-6 border-b border-slate-100",
                  "dark:border-slate-800",
                )}
              >
                <div
                  className={cn(
                    "p-3 bg-[#f8fafc] rounded-xl text-slate-500 border border-slate-100",
                    "dark:bg-slate-800/50 dark:border-slate-700",
                  )}
                >
                  <Mail size={22} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <p
                    className={cn(
                      "text-slate-700 text-sm md:text-base",
                      "dark:text-slate-200",
                    )}
                  >
                    barmm.distributor@example.com
                  </p>
                </div>
                <button className="text-[#00adb5] hover:opacity-70 transition-opacity">
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Phone Row */}
              <div
                className={cn(
                  "flex items-center gap-5 pb-6 border-b border-slate-100",
                  "dark:border-slate-800",
                )}
              >
                <div
                  className={cn(
                    "p-3 bg-[#f8fafc] rounded-xl text-slate-500 border border-slate-100",
                    "dark:bg-slate-800/50 dark:border-slate-700",
                  )}
                >
                  <Phone size={22} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <p
                    className={cn(
                      "text-slate-700 text-sm md:text-base",
                      "dark:text-slate-200",
                    )}
                  >
                    +1 (555) 123-4567
                  </p>
                </div>
                <button className="text-[#00adb5] hover:opacity-70 transition-opacity">
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Password Row */}
              <div className="flex items-center gap-5 pt-2">
                <div
                  className={cn(
                    "p-3 bg-[#f8fafc] rounded-xl text-slate-500 border border-slate-100",
                    "dark:bg-slate-800/50 dark:border-slate-700",
                  )}
                >
                  <Lock size={22} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="flex gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 bg-slate-800 rounded-full",
                          "dark:bg-slate-400",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <button className="text-[#00adb5] text-sm font-semibold hover:underline">
                  Change
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
