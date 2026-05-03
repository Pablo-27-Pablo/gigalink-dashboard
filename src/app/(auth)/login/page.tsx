"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion"; // Changed from motion/react for standard compatibility
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  HelpCircle,
  Wifi,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

import axiosInstance from "../../../components/axios/axios"; // Import the configured axios instance

import axios from "axios";
// import { setAuthCookie } from "@/app/actions/auth";
import Cookies from "js-cookie";

const portalConfig = {
  agent: {
    label: "Vendor Portal",
    icon: Wifi,
    color: "from-teal-500 to-teal-600",
    ring: "focus:ring-teal-500",
    button: "bg-teal-500 hover:bg-teal-600 shadow-teal-500/30",
    redirect: "/dashboard",
  },
  distributor: {
    label: "Distributor Portal",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600",
    ring: "focus:ring-blue-500",
    button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30",
    redirect: "/dashboard",
  },
  superadmin: {
    label: "Super Admin Portal",
    icon: ShieldCheck,
    color: "from-violet-500 to-violet-600",
    ring: "focus:ring-violet-500",
    button: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/30",
    redirect: "/dashboard",
  },
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine UI theme based on URL param, but the ACTUAL login will decide where to go
  const portalKey = (searchParams.get("portal") ??
    "agent") as keyof typeof portalConfig;
  const portalUI = portalConfig[portalKey] ?? portalConfig.agent;
  const Icon = portalUI.icon;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("api/auth/login", {
        email,
        password,
      });

      // 1. You extracted 'token' here
      const { token, portal, user } = response.data;
      const currentUserRole = response.data.portal; // Assuming the API returns the user's role as 'portal'
      const distributorId = user?.distributorId;
      const sellerId = user?.sellerId;
      const superadminId = user?.userId;

      console.log("✅ Login Response:", response.data.portal);

      // Log the entire response for debugging

      if (token) {
        // 2. Set the cookie using the 'token' variable (NOT 'data.token')
        // This allows your Middleware to see the session
        let sessionStore = "";
        if (currentUserRole == "distributor") {
          sessionStore = "distributorId";

          Cookies.set(`${sessionStore}`, distributorId, {
            expires: 1,
            path: "/",
          });
        } else if (currentUserRole == "seller") {
          sessionStore = "vendorId";
          Cookies.set(`${sessionStore}`, sellerId, {
            expires: 1,
            path: "/",
          });
        } else if (currentUserRole == "superadmin") {
          sessionStore = "superadminId";
          Cookies.set(`${sessionStore}`, superadminId, {
            expires: 1,
            path: "/",
          });
        }
        Cookies.set("session2", token, {
          expires: 1,
          path: "/",
          sameSite: "lax",
        });

        const targetPortal = (portal || portalKey) as keyof typeof portalConfig;
        const redirectPath =
          portalConfig[targetPortal]?.redirect || "/dashboard";

        // 3. Redirect
        router.push(redirectPath);
        router.refresh();
      }
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className={`bg-gradient-to-r ${portalUI.color} p-8 text-center`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon size={28} className="text-white" />
            <h2 className="text-2xl font-bold text-white">{portalUI.label}</h2>
          </div>
          <p className="text-white/80 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg ${portalUI.ring} focus:ring-2 focus:outline-none transition-all text-slate-900 dark:text-white`}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg ${portalUI.ring} focus:ring-2 focus:outline-none transition-all text-slate-900 dark:text-white`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${portalUI.button} text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/portal-selection")}
              className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              ← Back to Portal Selection
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-900" />}
    >
      <LoginForm />
    </Suspense>
  );
}
