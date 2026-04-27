"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Mail, Phone, Lock, User, Pencil } from "lucide-react";

export function VendorProfile() {
  const { theme, mounted } = useTheme();

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-full p-4 lg:p-6",
        mounted && theme === "dark" ? "bg-[#1E293B]" : "bg-slate-50",
      )}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <h1
            suppressHydrationWarning
            className={cn(
              "text-2xl lg:text-[32px] font-extrabold",
              mounted && theme === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            Profile Settings
          </h1>
          <p
            suppressHydrationWarning
            className={cn(
              "text-base",
              mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
            )}
          >
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div
          suppressHydrationWarning
          className={cn(
            "rounded-[14px] overflow-hidden",
            mounted && theme === "dark"
              ? "bg-[#1D293D] border border-[#314158]"
              : "bg-white border border-slate-200 shadow-md",
          )}
        >
          {/* Banner & Avatar */}
          <div className="relative">
            {/* Banner */}
            <div
              className="h-32 w-full"
              style={{
                background: "linear-gradient(90deg, #00BBA7 0%, #00BC7D 100%)",
              }}
            />
            {/* Avatar */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
              <div
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center border-4",
                  mounted && theme === "dark"
                    ? "bg-[#E2E8F0] border-[#1D293D]"
                    : "bg-slate-200 border-white",
                )}
              >
                <User
                  size={48}
                  className={
                    mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-400"
                  }
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-8 px-8 flex flex-col items-center gap-6">
            {/* Name & Role */}
            <div className="flex flex-col items-center gap-1">
              <h2
                suppressHydrationWarning
                className={cn(
                  "text-2xl font-bold",
                  mounted && theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                Vendor Smith
              </h2>
              <p
                suppressHydrationWarning
                className={cn(
                  "text-base",
                  mounted && theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                )}
              >
                Admin • Last active: Just now
              </p>
            </div>

            {/* Info Fields */}
            <div className="w-full flex flex-col gap-4">
              {/* Email */}
              <div
                className={cn(
                  "flex items-center gap-4 py-4 border-b",
                  mounted && theme === "dark"
                    ? "border-[#314158]"
                    : "border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-[10px] flex items-center justify-center",
                    mounted && theme === "dark" ? "bg-[#314158]" : "bg-slate-100",
                  )}
                >
                  <Mail
                    size={20}
                    className={
                      mounted && theme === "dark" ? "text-[#CAD5E2]" : "text-slate-500"
                    }
                  />
                </div>
                <div className="flex-1">
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-xs uppercase font-normal",
                      mounted && theme === "dark"
                        ? "text-[#90A1B9]"
                        : "text-slate-500",
                    )}
                  >
                    Email Address
                  </p>
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-base",
                      mounted && theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    agent.smith@example.com
                  </p>
                </div>
                <button
                  className={cn(
                    "p-1 rounded transition-colors",
                    mounted && theme === "dark"
                      ? "text-[#00BBA7] hover:text-[#00d5c7]"
                      : "text-teal-500 hover:text-teal-600",
                  )}
                >
                  <Pencil size={16} />
                </button>
              </div>

              {/* Phone */}
              <div
                className={cn(
                  "flex items-center gap-4 py-4 border-b",
                  mounted && theme === "dark"
                    ? "border-[#314158]"
                    : "border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-[10px] flex items-center justify-center",
                    mounted && theme === "dark" ? "bg-[#314158]" : "bg-slate-100",
                  )}
                >
                  <Phone
                    size={20}
                    className={
                      mounted && theme === "dark" ? "text-[#CAD5E2]" : "text-slate-500"
                    }
                  />
                </div>
                <div className="flex-1">
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-xs uppercase font-normal",
                      mounted && theme === "dark"
                        ? "text-[#90A1B9]"
                        : "text-slate-500",
                    )}
                  >
                    Phone Number
                  </p>
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-base",
                      mounted && theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    +1 (555) 123-4567
                  </p>
                </div>
                <button
                  className={cn(
                    "p-1 rounded transition-colors",
                    mounted && theme === "dark"
                      ? "text-[#00BBA7] hover:text-[#00d5c7]"
                      : "text-teal-500 hover:text-teal-600",
                  )}
                >
                  <Pencil size={16} />
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center gap-4 py-4">
                <div
                  className={cn(
                    "w-9 h-9 rounded-[10px] flex items-center justify-center",
                    mounted && theme === "dark" ? "bg-[#314158]" : "bg-slate-100",
                  )}
                >
                  <Lock
                    size={20}
                    className={
                      mounted && theme === "dark" ? "text-[#CAD5E2]" : "text-slate-500"
                    }
                  />
                </div>
                <div className="flex-1">
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-xs uppercase font-normal",
                      mounted && theme === "dark"
                        ? "text-[#90A1B9]"
                        : "text-slate-500",
                    )}
                  >
                    Password
                  </p>
                  <p
                    suppressHydrationWarning
                    className={cn(
                      "text-base",
                      mounted && theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    ••••••••••••
                  </p>
                </div>
                <button
                  className={cn(
                    "text-base font-normal transition-colors",
                    mounted && theme === "dark"
                      ? "text-[#00BBA7] hover:text-[#00d5c7]"
                      : "text-teal-500 hover:text-teal-600",
                  )}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
