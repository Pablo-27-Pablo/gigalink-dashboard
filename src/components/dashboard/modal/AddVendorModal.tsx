"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/components/axios/axios";
import Cookies from "js-cookie";

export interface VendorFormData {
  name: string;
  storeName: string;
  email: string;
  phone: string;
  location: string;
  password?: string;
  confirmPassword?: string;
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit: (
    data: { name: string; email: string; phone: string; location: string },
    assignments: Record<string, number>,
  ) => void;
}

// 1. Move static config outside to prevent re-creation on every render
const FORM_FIELDS = [
  { label: "Full Name", id: "name", Icon: User, type: "text" },
  { label: "Store Name", id: "storeName", Icon: Package, type: "text" },
  { label: "Email Address", id: "email", Icon: Mail, type: "email" },
  { label: "Phone Number", id: "phone", Icon: Phone, type: "tel" },
  { label: "Location", id: "location", Icon: MapPin, type: "text" },
  { label: "Password", id: "password", Icon: Lock, type: "password" },
  {
    label: "Confirm Password",
    id: "confirmPassword",
    Icon: CheckCircle2,
    type: "password",
  },
] as const;

export default function AddVendorModal({
  isOpen,
  onClose,
  onSuccess,
}: AddVendorModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [vendorData, setVendorData] = useState<VendorFormData>({
    name: "",
    storeName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const isPasswordTooShort =
    (vendorData.password?.length ?? 0) > 0 &&
    (vendorData.password?.length ?? 0) < 6;

  const isPasswordMismatch =
    (vendorData.confirmPassword?.length ?? 0) > 0 &&
    vendorData.password !== vendorData.confirmPassword;

  const handleCloseModal = () => {
    setVendorData({
      name: "",
      storeName: "",
      email: "",
      phone: "",
      location: "",
      password: "",
      confirmPassword: "",
    });
    onClose();
  };

  const handleSubmitVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, storeName, email, phone, location, password } = vendorData;

    if (!name || !storeName || !email || !phone || !location || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isPasswordTooShort || isPasswordMismatch) {
      toast.error("Please fix password errors");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating vendor account...");

    // 2. Ensure we have the necessary IDs before making the request
    const sessionToken = Cookies.get("session2");
    const sessionDistributorID = Cookies.get("distributorId");

    if (!sessionDistributorID) {
      toast.error("Distributor session expired. Please log in again.", {
        id: toastId,
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: name,
        storeName,
        email,
        phone,
        location,
        password,
      };

      await axiosInstance.post(
        `api/distributor/${sessionDistributorID}/sellers`,
        payload,
        {
          headers: {
            ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
          },
        },
      );

      toast.success("Vendor account created successfully!", { id: toastId });
      onSuccess?.();
      handleCloseModal();
    } catch (error: any) {
      // Handle the 409 Conflict specifically if the backend provides a message
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create account. Email or Store Name might already exist.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={20} className="text-teal-600" />
              Create Vendor Account
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmitVendor}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
              {FORM_FIELDS.map(({ label, id, Icon, type }) => {
                const isPasswordField = id === "password";
                const isConfirmField = id === "confirmPassword";
                const showError =
                  (isPasswordField && isPasswordTooShort) ||
                  (isConfirmField && isPasswordMismatch);

                return (
                  <div
                    key={`field-${id}`} // 3. Added prefix to ensure key is never just an empty string
                    className={id === "location" ? "md:col-span-2" : ""}
                  >
                    <label
                      htmlFor={id}
                      className="block text-xs font-semibold text-slate-500 uppercase mb-1"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <Icon
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                          showError ? "text-red-500" : "text-slate-400",
                        )}
                        size={18}
                      />
                      <input
                        id={id}
                        type={type}
                        required
                        autoComplete={isPasswordField ? "new-password" : "on"}
                        value={(vendorData as any)[id] || ""}
                        onChange={(e) =>
                          setVendorData((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none transition-all text-sm",
                          showError
                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500",
                        )}
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                    {isPasswordField && isPasswordTooShort && (
                      <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
                        Min. 6 characters required
                      </p>
                    )}
                    {isConfirmField && isPasswordMismatch && (
                      <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-teal-600 text-white font-bold shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
