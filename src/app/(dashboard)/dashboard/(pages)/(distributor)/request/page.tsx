"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Package, Send, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axiosInstance from "../../../../../../components/axios/axios";

interface RequestHistory {
  id: string;
  requestDate: string;
  plan: string;
  quantity: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedDate?: string;
  notes?: string;
}

interface Plan {
  planId: number; // From JSON
  planName: string; // From JSON (maps to your profileName)
  profileName?: string; // Added to support both data formats from your fetch calls
  dataLimitGb: number | null;
  durationDays: number | null;
  totalOwned: number;
  availableToAssign: number;
  assignedToSeller: number;
  activatedCount: number;
}

interface Seller {
  sellerId: number;
  fullName: string;
  storeName: string;
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
];

export default function VoucherRequest() {
  const [selectedPlanId, setSelectedPlanId] = useState(""); // FIXED: Added this missing variable
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [totalavailable, setTotalAvailable] = useState(0);
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    const sessionToken = Cookies.get("session2");
    const sessionDistributorID = Cookies.get("distributorId");

    // Fetch Inventory Summary
    axiosInstance
      .get(`api/distributor/${sessionDistributorID}/inventory-summary`, {
        headers: {
          ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        },
      })
      .then((res) => {
        const dataToSet = res.data && res.data.plans ? res.data.plans : [];
        console.log("✅ Inventory Summary Received plans:", dataToSet);
        if (Array.isArray(dataToSet)) {
          setPlans(dataToSet);
        }
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
      });

    // Fetch Sellers
    const fetchSellers = async () => {
      if (!sessionToken) return;
      try {
        const response = await axiosInstance.get(
          `api/distributor/${sessionDistributorID}/sellers`,
          {
            headers: { Authorization: `Bearer ${sessionToken}` },
          },
        );
        setSellers(response.data.sellers || []);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    // Fetch Plans
    // axiosInstance
    //   .get(`api/distributor/${sessionDistributorID}/plans`, {
    //     headers: {
    //       ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
    //     },
    //   })
    //   .then((res) => {
    //     // Logic to extract plans, defaulting to an empty array
    //     const dataToSet = res.data && res.data.plans ? res.data.plans : [];

    //     console.log("✅ Plans Received:", dataToSet);

    //     if (Array.isArray(dataToSet)) {
    //       setPlans(dataToSet);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("❌ Fetch Error:", err);
    //   });

    fetchInventory();
    fetchSellers();
  }, []);

  const remainingVouchers = {
    total: 4900,
  };

  // const handleSubmitRequest = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedPlanId || !quantity || !selectedSellerId) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }
  //   toast.success("Voucher request submitted successfully!");
  //   setShowForm(false);
  //   setSelectedPlanId("");
  //   setSelectedSellerId("");
  //   setQuantity("");
  //   setNotes("");
  // };

  const fetchInventory = useCallback(() => {
    const sessionToken = Cookies.get("session2");
    const sessionDistributorID = Cookies.get("distributorId");

    axiosInstance
      .get(`api/distributor/${sessionDistributorID}/inventory-summary`, {
        headers: {
          ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        },
      })
      .then((res) => {
        const dataToSet = res.data && res.data.plans ? res.data.plans : [];
        if (Array.isArray(dataToSet)) {
          setPlans(dataToSet);
        }

        const totalAvailable = (dataToSet as Plan[]).reduce(
          (acc, current) => acc + current.availableToAssign,
          0,
        );

        setTotalAvailable(totalAvailable);

        console.log("Total Available to Assign:", totalAvailable);
      })
      .catch((err) => console.error("❌ Fetch Error:", err));
  }, []);

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sessionToken = Cookies.get("session2");
    const sessionDistributorID = Cookies.get("distributorId");

    const payload = {
      assignments: [
        {
          profileName: selectedPlanId,
          quantity: parseInt(quantity, 10),
        },
      ],
    };

    try {
      const response = await axiosInstance.post(
        `api/distributor/${sessionDistributorID}/sellers/${selectedSellerId}/assign-vouchers`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Success:", response.data);

      // --- Success Toast ---
      toast.success("Vouchers assigned successfully!");
      setShowForm(false);
      fetchInventory();
    } catch (error: any) {
      console.error("Error assigning vouchers:", error);

      // --- Specific 409 Error Handling ---
      if (error.response?.status === 409) {
        toast.error("Your voucher balance is not enough.");
      } else {
        // General error message for other issues
        const errorMessage =
          error.response?.data?.message || "Failed to assign vouchers.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Inventory
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Send additional vouchers to Vendors
          </p>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {totalavailable.toLocaleString()}
          </div>
        </motion.div>

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
            {plans.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item.planName || item.profileName}
                  </span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.availableToAssign?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Request Form */}

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
                Select Plan *
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                required
              >
                <option value="">Select a plan </option>
                {plans.map((plan, index) => (
                  <option
                    key={plan.planId || `plan-${index}`}
                    value={plan.planName}
                  >
                    {plan.planName || plan.profileName}
                    {plan.dataLimitGb ? ` (${plan.dataLimitGb} GB)` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Seller *
              </label>
              <select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                required
              >
                <option value="">Select a seller </option>
                {sellers.map((seller) => (
                  <option key={seller.sellerId} value={seller.sellerId}>
                    {seller.fullName} — {seller.storeName}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 transition-colors"
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
    </div>
  );
}
