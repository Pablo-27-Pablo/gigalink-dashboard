"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Package,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/components/axios/axios";
import Cookies from "js-cookie";

interface Plan {
  id: string;
  name: string;
  validity: string;
  price: number;
  available: number;
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  onSubmit: (
    vendorData: VendorFormData,
    planAssignments: Record<string, number>,
  ) => void;
}

export interface VendorFormData {
  name: string;
  storeName: string;
  email: string;
  phone: string;
  location: string;
}

export default function AddVendorModal({
  isOpen,
  onClose,
  plans,
  onSubmit,
}: AddVendorModalProps) {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [vendorData, setVendorData] = useState<VendorFormData>({
    name: "",
    storeName: "",
    email: "",
    phone: "",
    location: "",
  });
  const [planAssignments, setPlanAssignments] = useState<
    Record<string, number>
  >({});

  const handleNext = () => {
    if (
      !vendorData.name ||
      !vendorData.storeName ||
      !vendorData.email ||
      !vendorData.phone ||
      !vendorData.location
    ) {
      toast.error("Please fill in all vendor information fields");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handlePlanQuantityChange = (planId: string, delta: number) => {
    setPlanAssignments((prev) => {
      const currentQty = prev[planId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const plan = plans.find((p) => p.id === planId);

      if (plan && newQty > plan.available) {
        toast.error(
          `Only ${plan.available} vouchers available for ${plan.name}`,
        );
        return prev;
      }

      if (newQty === 0) {
        const { [planId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [planId]: newQty };
    });
  };

  const getTotalVouchers = () => {
    return Object.values(planAssignments).reduce((sum, qty) => sum + qty, 0);
  };

  const handleAssignPlans = () => {
    if (getTotalVouchers() === 0) {
      toast.error("Please assign at least one plan to the vendor");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmAssignment = () => {
    onSubmit(vendorData, planAssignments);
    setShowConfirmation(false);
    setStep(1);
    setVendorData({
      name: "",
      storeName: "",
      email: "",
      phone: "",
      location: "",
    });
    setPlanAssignments({});
    onClose();
  };

  const handleSubmitVendor = async () => {
    try {
      // Basic validation
      if (
        !vendorData.name ||
        !vendorData.storeName ||
        !vendorData.email ||
        !vendorData.phone ||
        !vendorData.location
      ) {
        toast.error("Please fill all fields");
        return;
      }

      const payload = {
        fullName: vendorData.name,
        storeName: vendorData.storeName,
        email: vendorData.email,
        phone: vendorData.phone,
        location: vendorData.location,
        password: "TempPass123!", // you can randomize later
      };

      try {
        // Use your instance name here (e.g., apiClient)
        // The base URL is handled by the instance configuration
        const sessionToken = Cookies.get("session2");
        const sessionDistributorID = Cookies.get("distributorId");
        const response = await axiosInstance.post(
          `api/distributor/${sessionDistributorID}/sellers`,
          payload, // Second argument: The data
          {
            // Third argument: The config object
            headers: {
              // Only attach the header if the session exists
              ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
            },
          },
        );
        console.log("Success:", response.data);
      } catch (error) {
        console.error("Error posting vendor data:", error);
      }

      toast.success("Vendor added successfully!");

      // Reset + close
      //setShowConfirmSubmit(false);
      handleCloseModal();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add vendor");
    }
  };

  const handleCloseModal = () => {
    setStep(1);
    setVendorData({
      name: "",
      storeName: "",
      email: "",
      phone: "",
      location: "",
    });
    setPlanAssignments({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && !showConfirmation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {step === 1 ? "Vendor Information" : "Assign Plans"}
                  </span>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X
                      size={20}
                      className="text-slate-500 dark:text-slate-400"
                    />
                  </button>
                </div>

                {/* Modal Title */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                      {step === 1 ? (
                        <User className="text-white" size={28} />
                      ) : (
                        <Package className="text-white" size={28} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {step === 1 ? "Vendor Information" : "Assign Plans"}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {step === 1
                          ? "Enter the vendor's contact details"
                          : "Select plans and quantities to assign"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {[
                          {
                            label: "Full Name",
                            key: "name",
                            Icon: User,
                            type: "text",
                            placeholder: "Juan Dela Cruz",
                          },
                          {
                            label: "Store Name",
                            key: "storeName",
                            Icon: Package,
                            type: "text",
                            placeholder: "A&J",
                          },
                          {
                            label: "Email Address",
                            key: "email",
                            Icon: Mail,
                            type: "email",
                            placeholder: "juan@example.com",
                          },
                          {
                            label: "Phone Number",
                            key: "phone",
                            Icon: Phone,
                            type: "tel",
                            placeholder: "+63 917 123 4567",
                          },
                          {
                            label: "Location",
                            key: "location",
                            Icon: MapPin,
                            type: "text",
                            placeholder: "Manila, Metro Manila",
                          },
                        ].map(({ label, key, Icon, type, placeholder }) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              {label}
                            </label>
                            <div className="relative">
                              <Icon
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={20}
                              />
                              <input
                                type={type}
                                placeholder={placeholder}
                                value={vendorData[key as keyof VendorFormData]}
                                onChange={(e) =>
                                  setVendorData({
                                    ...vendorData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none text-slate-900 dark:text-white transition-all"
                              />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Vendor Summary Card */}
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                              <User
                                className="text-teal-600 dark:text-teal-400"
                                size={24}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {vendorData.name}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {vendorData.email}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Phone size={14} />
                              <span>{vendorData.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <MapPin size={14} />
                              <span>{vendorData.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Plans List */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                            Available Plans
                          </h3>
                          {plans.map((plan) => {
                            const assignedQty = planAssignments[plan.id] || 0;
                            return (
                              <div
                                key={plan.id}
                                className={cn(
                                  "border rounded-lg p-4 transition-all",
                                  assignedQty > 0
                                    ? "border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/10"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50",
                                )}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 dark:text-white">
                                      {plan.name}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1 text-sm">
                                      <span className="text-teal-600 dark:text-teal-400 font-medium">
                                        ₱{plan.price}
                                      </span>
                                      <span className="text-slate-500 dark:text-slate-400">
                                        {plan.validity}
                                      </span>
                                      <span className="text-slate-500 dark:text-slate-400">
                                        {plan.available} available
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      handlePlanQuantityChange(plan.id, -1)
                                    }
                                    disabled={assignedQty === 0}
                                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                  >
                                    <Minus
                                      size={18}
                                      className="text-slate-600 dark:text-slate-300"
                                    />
                                  </button>
                                  <input
                                    type="number"
                                    value={assignedQty}
                                    onChange={(e) => {
                                      const newQty = Math.max(
                                        0,
                                        Math.min(
                                          plan.available,
                                          parseInt(e.target.value) || 0,
                                        ),
                                      );
                                      setPlanAssignments((prev) =>
                                        newQty === 0
                                          ? (() => {
                                              const { [plan.id]: _, ...rest } =
                                                prev;
                                              return rest;
                                            })()
                                          : { ...prev, [plan.id]: newQty },
                                      );
                                    }}
                                    className="w-20 text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() =>
                                      handlePlanQuantityChange(plan.id, 1)
                                    }
                                    disabled={assignedQty >= plan.available}
                                    className="w-10 h-10 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                  >
                                    <Plus size={18} className="text-white" />
                                  </button>
                                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-auto">
                                    Total: ₱
                                    {(
                                      assignedQty * plan.price
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary */}
                        {getTotalVouchers() > 0 && (
                          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-4 text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-teal-50 mb-1">
                                  Total Vouchers
                                </p>
                                <p className="text-2xl font-bold">
                                  {getTotalVouchers()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-teal-50 mb-1">
                                  Total Value
                                </p>
                                <p className="text-2xl font-bold">
                                  ₱
                                  {Object.entries(planAssignments)
                                    .reduce((sum, [planId, qty]) => {
                                      const plan = plans.find(
                                        (p) => p.id === planId,
                                      );
                                      return sum + (plan?.price || 0) * qty;
                                    }, 0)
                                    .toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex gap-3">
                    {/* Cancel Button */}
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>

                    {/* Add Vendor Button */}
                    <button
                      onClick={handleSubmitVendor}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-cyan-700 transition-all"
                    >
                      Add Vendor
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4">
                    <AlertCircle
                      className="text-amber-600 dark:text-amber-400"
                      size={32}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
                    Confirm Voucher Assignment
                  </h3>
                  <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                    You are about to assign{" "}
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {getTotalVouchers()} vouchers
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {vendorData.name}
                    </span>
                    . This action will transfer the vouchers from your inventory
                    to the vendor's account.
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-6 space-y-2">
                    {Object.entries(planAssignments).map(([planId, qty]) => {
                      const plan = plans.find((p) => p.id === planId);
                      if (!plan) return null;
                      return (
                        <div
                          key={planId}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-700 dark:text-slate-300">
                            {plan.name}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {qty} vouchers
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmAssignment}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/30"
                    >
                      <CheckCircle2 size={18} /> Confirm & Assign
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
