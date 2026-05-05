"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Cookies from "js-cookie";
import axiosInstance from "@/components/axios/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Vendor {
  sellerId: number;
  fullName: string;
  storeName: string;
  email: string;
  phone: string;
  location: string;
  status: "Active" | "Inactive";
}

interface EditVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
}

export function EditVendorDialog({
  open,
  onOpenChange,
  vendor,
}: EditVendorDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    storeName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const isPasswordTooShort =
    formData.password.length > 0 && formData.password.length < 6;
  const isPasswordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  useEffect(() => {
    if (vendor && open) {
      setFormData({
        fullName: vendor.fullName,
        storeName: vendor.storeName,
        email: vendor.email,
        phone: vendor.phone,
        location: vendor.location,
        password: "",
        confirmPassword: "",
      });
    }
  }, [vendor, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    if (isPasswordTooShort || isPasswordMismatch) {
      toast.error("Please resolve the security errors first");
      return;
    }

    const toastId = toast.loading("Updating vendor...");
    try {
      const payload: any = {
        fullName: formData.fullName,
        storeName: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      };

      // Only send password if field is not empty
      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      await axiosInstance.patch(
        `api/distributor/${Cookies.get("distributorId")}/sellers/${vendor.sellerId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("session2")}`,
          },
        },
      );

      toast.success("Profile updated successfully", { id: toastId });
      onOpenChange(false);
      window.setTimeout(() => window.location.reload(), 700);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden border-none bg-white dark:bg-slate-900 shadow-2xl rounded-3xl">
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-500" />

        <DialogHeader className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <User size={32} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Edit Vendor Profile
              </DialogTitle>
              <p className="text-slate-500 dark:text-slate-400">
                Manage contact info and security credentials
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              Profile Details
              <span className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  Full Name
                </label>
                <div className="group relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-teal-500/30 focus-visible:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  Store Name
                </label>
                <div className="group relative">
                  <Store
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <Input
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-teal-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  Email
                </label>
                <div className="group relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-teal-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  Phone
                </label>
                <div className="group relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-teal-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  Physical Location
                </label>
                <div className="group relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors"
                    size={18}
                  />
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-teal-500/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Security */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-5 space-y-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <ShieldCheck size={16} className="text-teal-500" />
                Account Security
              </div>
              <span className="text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400">
                Optional Reset
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  New Password
                </label>
                <div className="group relative">
                  <Lock
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                      isPasswordTooShort
                        ? "text-red-500"
                        : "text-slate-400 group-focus-within:text-teal-500",
                    )}
                    size={18}
                  />
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cn(
                      "pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-teal-500/30",
                      isPasswordTooShort &&
                        "border-red-500 focus-visible:ring-red-500/20",
                    )}
                  />
                </div>
                {isPasswordTooShort && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={10} /> Must be at least 6 characters
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold ml-1 text-slate-600 dark:text-slate-300">
                  Confirm Reset
                </label>
                <div className="group relative">
                  <CheckCircle2
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                      isPasswordMismatch
                        ? "text-red-500"
                        : "text-slate-400 group-focus-within:text-teal-500",
                    )}
                    size={18}
                  />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cn(
                      "pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-teal-500/30",
                      isPasswordMismatch &&
                        "border-red-500 focus-visible:ring-red-500/20",
                    )}
                  />
                </div>
                {isPasswordMismatch && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={10} /> Passwords do not match
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 font-semibold"
            >
              Discard
            </Button>
            <Button
              type="submit"
              className="flex-[2] h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
            >
              Update Vendor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
