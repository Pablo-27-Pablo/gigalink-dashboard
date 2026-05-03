"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../../../../components/axios/axios";
import Cookies from "js-cookie";
import {
  Search,
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
} from "lucide-react";

// --- Mock Data Updated from JSON ---
const stats = [
  { label: "Total Distributors", value: "3", color: "text-slate-900" },
  { label: "Active", value: "3", color: "text-emerald-600" },
];

export default function DistributorDashboard() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] =
    useState<Distributor | null>(null);
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  interface Distributor {
    distributorId: number;
    distributorName: string;
    email: string;
    phone: string;
    regionId: number;
    regionName: string;
    totalOwnedVouchers: number;
    isActive: boolean;
    status: string;
    // Add any other fields you receive from the API
  }

  // Handlers for Form Modal (Add/Edit)
  const handleEditClick = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedDistributor(null);
    setIsFormModalOpen(true);
  };

  // Handlers for Delete Modal
  const handleDeleteClick = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDistributor(null);
  };

  useEffect(() => {
    // 1. Retrieve the session token from cookies
    const sessionToken = Cookies.get("session2");
    console.log("🔍 Superadmin Session Token:", sessionToken);

    // 2. Perform the request using your axiosInstance
    // Note: Ensure your axiosInstance baseURL is set to 'http://121.58.249.168:3033/'
    axiosInstance
      .get("api/superadmin/distributors/", {
        headers: {
          // Attach Bearer token if it exists
          ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        },
      })
      .then((res) => {
        // 3. Handle the response data
        // We check if the data is directly in res.data or nested in res.data.distributors
        setDistributors(res.data.distributors || res.data);
        console.log("✅ Distributors API Response:", res.data);
        const dataToSet = Array.isArray(res.data)
          ? res.data
          : res.data.distributors;
        console.log("✅ Distributors API Response:", res.data);

        if (Array.isArray(dataToSet)) {
        } else {
          console.error("❌ Unexpected API structure:", res.data);
          setDistributors([]);
        }
      })
      .catch((err) => {
        console.error("❌ Fetch Error (Distributors):", err);
        setDistributors([]);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 font-sans text-slate-900 bg-slate-50/30">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Distributor Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage distributors and their voucher allocations
          </p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Distributor
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <p className="text-slate-500 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Distributor</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Region</th>
                <th className="px-6 py-4">Inventory</th>

                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {distributors.map((item, index) => (
                <tr
                  key={`${item.distributorId}-${index}`}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {item.distributorName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-slate-600">{item.email}</div>
                    <div className="text-slate-400">{item.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-bold">
                      {item.regionName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {item.totalOwnedVouchers}
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.usage > 85 ? "bg-red-500" : "bg-teal-500"}`}
                          style={{ width: `${item.usage}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {item.usage}%
                      </span>
                    </div>
                  </td> */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 hover:bg-slate-100 hover:text-emerald-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 hover:bg-slate-100 hover:text-red-600 rounded-lg transition-colors"
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

      {/* --- Modals --- */}
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

// --- Delete Confirmation Modal Component ---
function DeleteConfirmationModal({
  onClose,
  distributorName,
}: {
  onClose: () => void;
  distributorName: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Delete Distributor
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-slate-500 text-sm leading-relaxed">
              Are you sure you want to delete this distributor? All associated
              data will be permanently removed.
            </p>

            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <span className="text-red-800 font-semibold text-sm">
                {distributorName}
              </span>
            </div>

            <p className="text-slate-400 text-xs italic">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 bg-white text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Form Modal (Add/Edit) ---
function DistributorFormModal({
  onClose,
  distributor,
}: {
  onClose: () => void;
  distributor: any;
}) {
  const isEdit = !!distributor;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg h-auto max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 flex justify-between items-start border-b border-slate-100">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {isEdit ? "Edit Distributor" : "Add New Distributor"}
              </h2>
              <p className="text-sm text-slate-500">
                {isEdit
                  ? "Update distributor information"
                  : "Register a new distributor partner"}
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

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <FormField
            label="Company Name"
            icon={<Building2 size={18} />}
            defaultValue={distributor?.distributorName}
            placeholder="e.g., Clark Area Distributor"
          />
          <FormField
            label="Contact Person"
            icon={<User size={18} />}
            defaultValue={distributor?.distributorName}
            placeholder="Juan Dela Cruz"
          />
          <FormField
            label="Email Address"
            icon={<Mail size={18} />}
            defaultValue={distributor?.email}
            placeholder="contact@company.ph"
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
          <FormField
            label="Vouchers (Qty)"
            icon={<Database size={18} />}
            defaultValue={distributor?.totalOwnedVouchers?.toString()}
            placeholder="e.g., 500"
          />
        </div>

        <div className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 bg-white text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:opacity-90 shadow-md shadow-emerald-500/20">
            {isEdit ? "Update Distributor" : "Add Distributor"}
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
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
        {label} <span className="text-red-500 text-[10px]">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
        />
      </div>
    </div>
  );
}
