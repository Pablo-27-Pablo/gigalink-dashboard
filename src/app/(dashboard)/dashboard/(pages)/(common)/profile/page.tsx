"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, Lock, Edit2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import axiosInstance from "../../../../../../components/axios/axios";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  roleName?: string;
  distributorId?: string | number;
  vendorId?: string | number;
  [key: string]: any;
}

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const sessionToken = Cookies.get("session2");

      if (!sessionToken) {
        setLoading(false);
        return;
      }

      try {
        const decoded: JWTPayload = jwtDecode(sessionToken);
        const role = decoded.roleName?.toLowerCase();

        const distributorId =
          decoded.distributorId || Cookies.get("distributorId");
        const sellerId = decoded.vendorId || Cookies.get("vendorId");

        let endpoint = "";

        if (role === "superadmin" || role === "admin") {
          endpoint = `api/superadmin/profile`;
        } else if (role === "seller") {
          endpoint = `api/seller/${sellerId}/profile`;
        } else if (role === "distributor") {
          endpoint = `api/distributor/${distributorId}/profile`;
        } else {
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("❌ Profile Error:", err);
        toast.error("Failed to load profile session");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00adb5]" />
      </div>
    );
  }

  const displayName =
    profile?.distributorName ||
    profile?.sellerName ||
    profile?.name ||
    "User Profile";

  return (
    <div className={cn("min-h-screen transition-colors", "")}>
      <main className="max-w-4xl mx-auto pt-12 pb-20 px-4">
        <div className="text-center mb-10">
          <h1
            className={cn(
              "text-3xl font-bold text-[#0f172a]",
              "dark:text-white",
            )}
          >
            {profile?.roleName?.toUpperCase() || "USER"} SETTINGS
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
            "dark:bg-slate-900 dark:border-slate-800",
          )}
        >
          <div className="h-44 bg-[#00adb5] relative flex justify-center">
            <div className="absolute -bottom-14">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-[#f1f5f9] flex items-center justify-center text-slate-400 dark:border-slate-900 dark:bg-slate-800">
                <User size={54} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-12 px-10">
            <h2 className="text-2xl font-bold text-[#0f172a] text-center mb-12 dark:text-white">
              {displayName}
            </h2>

            <div className="max-w-xl mx-auto space-y-8">
              {/* Email Row */}
              <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 bg-[#f8fafc] rounded-xl text-slate-500 dark:bg-slate-800/50">
                  <Mail size={22} />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <p className="text-slate-700 dark:text-slate-200">
                    {profile?.email}
                  </p>
                </div>
                <button className="text-[#00adb5] hover:opacity-70 transition-opacity">
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Phone Row */}
              {profile?.phone && (
                <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-[#f8fafc] rounded-xl text-slate-500 dark:bg-slate-800/50">
                    <Phone size={22} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Phone
                    </label>
                    <p className="text-slate-700 dark:text-slate-200">
                      {profile?.phone}
                    </p>
                  </div>
                  <button className="text-[#00adb5] hover:opacity-70 transition-opacity">
                    <Edit2 size={18} />
                  </button>
                </div>
              )}

              {/* Password Row */}
              <div className="flex items-center gap-5 pt-2">
                <div className="p-3 bg-[#f8fafc] rounded-xl text-slate-500 dark:bg-slate-800/50">
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
                <button
                  onClick={() =>
                    toast.info("Password change feature coming soon!")
                  }
                  className="text-[#00adb5] text-sm font-semibold hover:underline"
                >
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
