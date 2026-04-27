"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
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
    redirect: "/distributor/dashboard",
  },
  superadmin: {
    label: "Super Admin Portal",
    icon: ShieldCheck,
    color: "from-violet-500 to-violet-600",
    ring: "focus:ring-violet-500",
    button: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/30",
    redirect: "/superadmin/dashboard",
  },
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const portalKey = (searchParams.get("portal") ??
    "agent") as keyof typeof portalConfig;
  const portal = portalConfig[portalKey] ?? portalConfig.agent;
  const Icon = portal.icon;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(portal.redirect);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${portal.color} p-8 text-center`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon size={28} className="text-white" />
            <h2 className="text-2xl font-bold text-white">{portal.label}</h2>
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
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg ${portal.ring} focus:ring-2 focus:outline-none transition-all text-slate-900 dark:text-white`}
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
                  className={`w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg ${portal.ring} focus:ring-2 focus:outline-none transition-all text-slate-900 dark:text-white`}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <a
                href="#"
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${portal.button} text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <a
          href="/faqs"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <HelpCircle size={16} /> Have questions? View our FAQ
        </a>
      </motion.div>
    </div>
  );
}

export function Login() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-900" />}
    >
      <LoginForm />
    </Suspense>
  );
}
