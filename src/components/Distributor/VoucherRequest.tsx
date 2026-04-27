"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Package, Send, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DistributorLayout } from "@/components/Distributor/DistributorLayout";

interface RequestHistory {
  id: string;
  requestDate: string;
  plan: string;
  quantity: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedDate?: string;
  notes?: string;
}

const mockRequests: RequestHistory[] = [
  {
    id: "REQ-001",
    requestDate: "2025-03-20",
    plan: "Premium 50GB",
    quantity: 500,
    status: "Approved",
    approvedDate: "2025-03-21",
    notes: "Approved by SuperAdmin",
  },
  {
    id: "REQ-002",
    requestDate: "2025-03-22",
    plan: "Basic 10GB",
    quantity: 1000,
    status: "Pending",
  },
  {
    id: "REQ-003",
    requestDate: "2025-03-15",
    plan: "Standard 25GB",
    quantity: 750,
    status: "Rejected",
    approvedDate: "2025-03-16",
    notes: "Insufficient bandwidth allocation",
  },
];

const voucherPlans = [
  { name: "Basic 10GB", bandwidth: "10 GB", validity: "30 days" },
  { name: "Standard 25GB", bandwidth: "25 GB", validity: "30 days" },
  { name: "Premium 50GB", bandwidth: "50 GB", validity: "60 days" },
  { name: "Giga 100GB", bandwidth: "100 GB", validity: "90 days" },
];

export function VoucherRequest() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);

  const remainingVouchers = {
    total: 4900,
    byPlan: [
      { plan: "Basic 10GB", count: 1200 },
      { plan: "Standard 25GB", count: 1500 },
      { plan: "Premium 50GB", count: 1800 },
      { plan: "Giga 100GB", count: 400 },
    ],
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Voucher request submitted successfully!");
    setShowForm(false);
    setSelectedPlan("");
    setQuantity("");
    setNotes("");
  };

  return (
    <DistributorLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Voucher Request
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Request additional vouchers from SuperAdmin
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            New Request
          </button>
        </div>

        {/* Current Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Remaining */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-1">
                  Total Remaining Vouchers
                </h3>
                <p className="text-sm text-teal-700 dark:text-teal-300">
                  Available in your inventory
                </p>
              </div>
              <div className="p-3 bg-teal-500 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
            </div>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
              {remainingVouchers.total.toLocaleString()}
            </div>
          </motion.div>

          {/* By Plan Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Inventory by Plan
            </h3>
            <div className="space-y-3">
              {remainingVouchers.byPlan.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {item.plan}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Request Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              New Voucher Request
            </h3>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Voucher Plan *
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  >
                    <option value="">Select a plan</option>
                    {voucherPlans.map((plan) => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name} - {plan.bandwidth} ({plan.validity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional notes for SuperAdmin..."
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Send size={16} />
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Request History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Request History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {mockRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                        {request.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {request.requestDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {request.plan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {request.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full",
                          request.status === "Approved" &&
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                          request.status === "Pending" &&
                            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
                          request.status === "Rejected" &&
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        )}
                      >
                        {request.status === "Approved" && <CheckCircle size={12} />}
                        {request.status === "Pending" && <Clock size={12} />}
                        {request.status === "Rejected" && <XCircle size={12} />}
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {request.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </DistributorLayout>
  );
}
