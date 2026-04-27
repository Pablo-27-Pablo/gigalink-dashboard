"use client";

import { User, Mail, Phone, Lock, Edit } from "lucide-react";
import { motion } from "motion/react";
import { Layout } from "@/components/Layout";

export function Profile() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account information and preferences.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-500 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 flex items-center justify-center text-slate-400">
                <User size={48} />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Smith</h2>
            <p className="text-slate-500 dark:text-slate-400">Admin • Last active: Just now</p>

            <div className="mt-8 space-y-6 text-left">
              <div className="flex items-center gap-4 py-4 border-b dark:border-slate-700">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                  <Mail size={20} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                  <p className="text-slate-900 dark:text-white">agent.smith@example.com</p>
                </div>
                <button className="ml-auto text-teal-500 hover:text-teal-600">
                  <Edit size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 py-4 border-b dark:border-slate-700">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                  <Phone size={20} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Phone Number</label>
                  <p className="text-slate-900 dark:text-white">+1 (555) 123-4567</p>
                </div>
                <button className="ml-auto text-teal-500 hover:text-teal-600">
                  <Edit size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                  <Lock size={20} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Password</label>
                  <p className="text-slate-900 dark:text-white">••••••••••••</p>
                </div>
                <button className="ml-auto text-teal-500 hover:text-teal-600 text-sm font-medium">
                  Change
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
