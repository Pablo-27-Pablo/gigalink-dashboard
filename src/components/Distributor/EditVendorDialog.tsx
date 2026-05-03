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
import { User, Store, Mail, Phone, MapPin } from "lucide-react";
import Cookies from "js-cookie";
import axiosInstance from "@/components/axios/axios";

interface Vendor {
  id: string;
  name: string;
  storeName: string;
  email: string;
  phone: string;
  location: string;
  assignedVouchers: number;
  activatedVouchers: number;
  status: "Active" | "Inactive";
  joinedDate: string;
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
  });

  // ✅ Sync form when vendor changes
  useEffect(() => {
    if (vendor) {
      setFormData({
        fullName: vendor.name,
        storeName: vendor.storeName,
        email: vendor.email,
        phone: vendor.phone,
        location: vendor.location,
      });
    }
  }, [vendor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendor) return;

    const sessionToken = Cookies.get("session2");

    const payload = {
      fullName: formData.fullName,
      storeName: formData.storeName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
    };

    try {
      const response = await axiosInstance.patch(
        `api/distributor/2/sellers/${vendor.id}`,
        payload,
        {
          headers: {
            ...(sessionToken && {
              Authorization: `Bearer ${sessionToken}`,
            }),
          },
        },
      );

      console.log("✅ Update Successful:", response.data);

      onOpenChange(false); // close modal

      // 🔥 optional quick refresh
      window.location.reload();
    } catch (err: any) {
      console.error("❌ Update Error:", err.response?.data || err.message);
      alert("Failed to update vendor settings.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0 overflow-hidden shadow-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="bg-teal-500 rounded-xl p-3 text-white shadow-sm">
              <User size={28} />
            </div>

            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Edit Vendor Information
              </DialogTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Edit the vendor&apos;s contact details
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-10 bg-slate-100 dark:bg-slate-700 border-0 focus-visible:ring-1 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          {/* Store Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Store Name
            </label>
            <div className="relative">
              <Store
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                className="pl-10 bg-slate-100 dark:bg-slate-700 border-0 focus-visible:ring-1 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-slate-100 dark:bg-slate-700 border-0 focus-visible:ring-1 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 bg-slate-100 dark:bg-slate-700 border-0 focus-visible:ring-1 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Location
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="pl-10 bg-slate-100 dark:bg-slate-700 border-0 focus-visible:ring-1 focus-visible:ring-teal-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-5 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-slate-100 dark:bg-slate-700 border-0 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white shadow-md"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
