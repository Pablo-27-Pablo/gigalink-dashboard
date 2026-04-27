"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Wifi, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";

const portals = [
  {
    label: "Agent",
    subtitle: "Manage vouchers, sessions & history",
    icon: Wifi,
    href: "/login?portal=agent",
    color: "from-teal-500 to-teal-600",
    ring: "hover:ring-teal-400/40",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-400",
    button: "bg-teal-500 hover:bg-teal-600 shadow-teal-500/30",
  },
  {
    label: "Distributor",
    subtitle: "Manage vendors, voucher assignment & sales",
    icon: Briefcase,
    href: "/login?portal=distributor",
    color: "from-blue-500 to-blue-600",
    ring: "hover:ring-blue-400/40",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30",
  },
  {
    label: "Super Admin",
    subtitle: "Full system control & oversight",
    icon: ShieldCheck,
    href: "/login?portal=superadmin",
    color: "from-violet-500 to-violet-600",
    ring: "hover:ring-violet-400/40",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
    button: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/30",
  },
];

export function PortalSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 mb-4 shadow-lg shadow-teal-500/30">
          <Wifi size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">GIGALINK</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Select your portal to continue</p>
      </motion.div>

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => router.push(portal.href)}
            className={`cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:ring-2 ${portal.ring} transition-all overflow-hidden`}
          >
            <div className={`h-1.5 w-full bg-gradient-to-r ${portal.color}`} />
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className={`w-16 h-16 rounded-2xl ${portal.bg} flex items-center justify-center`}>
                <portal.icon size={32} className={portal.text} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{portal.label}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{portal.subtitle}</p>
              </div>
              <button className={`w-full py-3 px-4 ${portal.button} text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors group`}>
                Enter Portal
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push("/")}
        className="mt-10 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        ← Back to Home
      </motion.button>
    </div>
  );
}
