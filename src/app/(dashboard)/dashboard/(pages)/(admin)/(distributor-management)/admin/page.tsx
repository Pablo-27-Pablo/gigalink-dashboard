"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../../../../components/axios/axios";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Ban,
  Building2,
  X,
  User,
  Mail,
  Phone,
  Globe,
  Database,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";

export default function DistributorDashboard() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any | null>(
    null,
  );
  const [distributors, setDistributors] = useState<any[]>([]);

  const handleEditClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedDistributor(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDistributor(null);
  };

  const totalDistributors = distributors.length;
  const activeDistributors = distributors.filter(
    (d) => d.status === "Active",
  ).length;

  const stats = [
    {
      label: "Total Distributors",
      value: totalDistributors.toString(),
      color: "text-[#0f172a] dark:text-white",
    },
    {
      label: "Active",
      value: activeDistributors.toString(),
      color: "text-emerald-600",
    },
  ];

  useEffect(() => {
    const sessionToken = Cookies.get("session2");
    axiosInstance
      .get("api/superadmin/distributors/", {
        headers: {
          ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        },
      })
      .then((res) => {
        const dataToSet = Array.isArray(res.data)
          ? res.data
          : res.data.distributors;
        setDistributors(dataToSet || []);
      })
      .catch(() => setDistributors([]));
  }, []);

  return (
    <div className="min-h-screen p-8 transition-colors">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white">
            Distributor Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage distributors and their voucher allocations
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="bg-[#00adb5] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm"
        >
          <Plus size={20} />
          Add Distributor
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm"
          >
            <p className="text-slate-500 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className={cn("text-4xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Distributor</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Region</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {distributors.map((item, index) => (
                <tr
                  key={`${item.distributorId}-${index}`}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl flex items-center justify-center text-[#00adb5]">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0f172a] dark:text-slate-200">
                          {item.distributorName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-slate-600 dark:text-slate-300">
                      {item.email}
                    </div>
                    <div className="text-slate-400">{item.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-[#00adb5] rounded-full text-[10px] font-bold">
                      {item.regionName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.totalOwnedVouchers}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold",
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                          : "bg-red-50 text-red-600 dark:bg-red-950/30",
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#00adb5] rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Ban size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <DistributorFormModal
          onClose={closeModals}
          distributor={selectedDistributor}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={closeModals}
          distributorName={
            selectedDistributor?.distributorName || "this distributor"
          }
        />
      )}
    </div>
  );
}

function DistributorFormModal({
  onClose,
  distributor,
}: {
  onClose: () => void;
  distributor: any;
}) {
  const isEdit = !!distributor;
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // REAL-TIME VALIDATION EFFECT
  useEffect(() => {
    let newErrors = { password: "", confirmPassword: "" };

    // Logic: Only validate if they start typing, OR if it's a mandatory field (Add mode)
    const passwordEntered = formData.password.length > 0;
    const confirmEntered = formData.confirmPassword.length > 0;

    // Password Length Check
    if (passwordEntered && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!isEdit && !passwordEntered) {
      newErrors.password = "Password is required for new accounts";
    }

    // Match Check (only if they typed in confirm)
    if (
      passwordEntered &&
      confirmEntered &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    } else if (!isEdit && passwordEntered && !confirmEntered) {
      // Optional: show hint that confirm is missing in add mode
    }

    setErrors(newErrors);
  }, [formData, isEdit]);

  const handleSubmit = () => {
    const hasErrors = errors.password !== "" || errors.confirmPassword !== "";
    if (!hasErrors) {
      console.log("Submitting Data...", formData);
      onClose();
    }
  };

  const isSubmitDisabled =
    errors.password !== "" || errors.confirmPassword !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all">
        {/* Header */}
        <div className="p-6 flex justify-between items-start border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#00adb5] rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">
                {isEdit ? "Edit Distributor" : "Add New Distributor"}
              </h2>
              <p className="text-sm text-slate-500">
                {isEdit
                  ? "Update account credentials"
                  : "Create a new partner account"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
          <FormField
            label="Company Name"
            icon={<Building2 size={18} />}
            defaultValue={distributor?.distributorName}
            placeholder="e.g. Acme Corp"
          />
          <FormField
            label="Email Address"
            icon={<Mail size={18} />}
            defaultValue={distributor?.email}
            placeholder="contact@email.com"
          />

          <FormField
            label="Phone Number"
            icon={<Phone size={18} />}
            defaultValue={distributor?.phone}
            placeholder="09171234567"
          />
          <FormField
            label="Region"
            icon={<Globe size={18} />}
            defaultValue={distributor?.regionName}
            placeholder="Select Region"
          />

          {!isEdit && (
            <FormField
              label="Vouchers (Qty)"
              icon={<Database size={18} />}
              placeholder="e.g., 500"
            />
          )}

          {/* Informative Upper Note (Edit Mode Only) */}
          {isEdit && (
            <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl transition-all">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-400">
                  Password Modification
                </p>
                <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300">
                  If you do not want to change the distributor's password,
                  please leave the password and confirmation fields below empty.
                </p>
              </div>
            </div>
          )}

          <div
            className={cn(
              "space-y-4",
              isEdit
                ? "pt-2"
                : "pt-4 border-t border-slate-100 dark:border-slate-800",
            )}
          >
            <FormField
              label={isEdit ? "Change Password" : "Password"}
              type={showPass ? "text" : "password"}
              icon={<Lock size={18} />}
              placeholder="••••••••"
              error={errors.password}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-slate-400 hover:text-[#00adb5] focus:outline-none transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <FormField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              icon={<Lock size={18} />}
              placeholder="••••••••"
              error={errors.confirmPassword}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-slate-400 hover:text-[#00adb5] focus:outline-none transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={cn(
              "flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all shadow-md",
              isSubmitDisabled
                ? "bg-slate-400 cursor-not-allowed shadow-none"
                : "bg-[#00adb5] hover:opacity-90 shadow-cyan-500/20",
            )}
          >
            {isEdit ? "Update Distributor" : "Add Distributor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  onClose,
  distributorName,
}: {
  onClose: () => void;
  distributorName: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">
              Delete Distributor
            </h2>
          </div>
          <p className="text-slate-500 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-red-600 font-bold">{distributorName}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-xl dark:text-white"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-md">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon,
  placeholder,
  defaultValue,
  value,
  type = "text",
  error,
  onChange,
  rightElement,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-400 flex items-center gap-1">
        {label} <span className="text-red-500 text-[10px]">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl focus:outline-none transition-all text-sm",
            "dark:bg-slate-800 dark:text-slate-200",
            error
              ? "border-red-500 focus:border-red-500 shadow-sm shadow-red-100"
              : "border-slate-200 dark:border-slate-700 focus:border-[#00adb5]",
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={12} />
          <span className="text-[10px] font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
