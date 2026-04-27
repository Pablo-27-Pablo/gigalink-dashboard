"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ✅ added
import {
  Plus,
  Search,
  User,
  Edit,
  Power,
  RotateCcw,
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Package,
  Store,
  Ticket,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
//import { DistributorLayout } from "@/components/Distributor/DistributorLayout";
//import { AddVendorModal } from "@/components/dashboard/modal/AddVendorModal";
import { EditVendorDialog } from "@/components/Distributor/EditVendorDialog";
import { toast } from "sonner";
import axiosInstance from "@/components/axios/axios";

interface Seller {
  sellerId: number;
  fullName: string;
  storeName: string;
  email: string;
  phone: string;
  location: string;
  assignedVouchers: number;
  activatedVouchers: number;
  lastLoginAt: string | null;
  status: "Active" | "Inactive"; // added for UI compatibility
  joinedDate: string; // added for UI compatibility
}

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

export interface Plan {
  id: string;
  name: string;
  validity: string;
  price: number;
  available: number;
}

export interface PlanSale {
  planName: string;
  dataVoucher: string;
  qtySold: number;
  qtyActivated: number;
  totalGb: number;
}
// const initialSellers: Seller[] = [
//   {
//     sellerId: 1,
//     fullName: "Ju Dela Cruz",
//     storeName: "A&J",
//     email: "juan@vendor1.com",
//     phone: "+63 917 123 4567",
//     location: "Bongao, Tawi Tawi",
//     assignedVouchers: 1500,
//     activatedVouchers: 1350,
//     lastLoginAt: null,
//     status: "Active",
//     joinedDate: "2025-01-15",
//   },
//   {
//     sellerId: 2,
//     fullName: "Mar Santos",
//     storeName: "Kyukyu",
//     email: "maria@vendor2.com",
//     phone: "+63 918 234 5678",
//     location: "Languyan, Tawi Tawi",
//     assignedVouchers: 1200,
//     activatedVouchers: 1050,
//     lastLoginAt: null,
//     status: "Active",
//     joinedDate: "2025-02-10",
//   },
//   {
//     sellerId: 3,
//     fullName: "Pedro Reyes",
//     storeName: "Pedro's",
//     email: "pedro@vendor3.com",
//     phone: "+63 919 345 6789",
//     location: "Sibutu, Tawi Tawi",
//     assignedVouchers: 800,
//     activatedVouchers: 600,
//     lastLoginAt: null,
//     status: "Inactive",
//     joinedDate: "2024-12-20",
//   },
// ];

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Basic Plan - 01 Day",
    validity: "01 Day",
    price: 50,
    available: 500,
  },
  {
    id: "2",
    name: "Standard Plan - 03 Days",
    validity: "03 Days",
    price: 100,
    available: 350,
  },
  {
    id: "3",
    name: "Premium Plan - 15 Days",
    validity: "15 Days",
    price: 300,
    available: 200,
  },
  {
    id: "4",
    name: "Giga Plan - 30 Days",
    validity: "30 Days",
    price: 550,
    available: 150,
  },
];

const mockPlanSales: PlanSale[] = [
  {
    planName: "Basic Plan - 30 Days",
    dataVoucher: "5GB",
    qtySold: 500,
    qtyActivated: 450,
    totalGb: 2250,
  },
  {
    planName: "Standard Plan - 60 Days",
    dataVoucher: "10GB",
    qtySold: 400,
    qtyActivated: 380,
    totalGb: 3800,
  },
  {
    planName: "Premium Plan - 90 Days",
    dataVoucher: "10GB",
    qtySold: 500,
    qtyActivated: 450,
    totalGb: 4500,
  },
  {
    planName: "Ultimate Plan - 180 Days",
    dataVoucher: "20GB",
    qtySold: 300,
    qtyActivated: 280,
    totalGb: 5600,
  },
];

const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Juan Dela Cruz",
    storeName: "A&J",
    email: "juan@vendor1.com",
    phone: "+63 917 123 4567",
    location: "Bongao, Tawi Tawi",
    assignedVouchers: 1500,
    activatedVouchers: 1350,
    status: "Active",
    joinedDate: "2025-01-15",
  },
  {
    id: "4",
    name: "Ana Garcia",
    storeName: "Ana's",
    email: "ana@vendor4.com",
    phone: "+63 920 456 7890",
    location: "Tandubas, Tawi Tawi",
    assignedVouchers: 950,
    activatedVouchers: 850,
    status: "Active",
    joinedDate: "2025-03-01",
  },
  {
    id: "2",
    name: "Maria Santos",
    storeName: "Kyukyu",
    email: "maria@vendor2.com",
    phone: "+63 918 234 5678",
    location: "Languyan, Tawi Tawi",
    assignedVouchers: 1200,
    activatedVouchers: 1050,
    status: "Active",
    joinedDate: "2025-02-10",
  },
  {
    id: "3",
    name: "Pedro Reyes",
    storeName: "Pedro's",
    email: "pedro@vendor3.com",
    phone: "+63 919 345 6789",
    location: "Sibutu, Tawi Tawi",
    assignedVouchers: 800,
    activatedVouchers: 600,
    status: "Inactive",
    joinedDate: "2024-12-20",
  },
  {
    id: "4",
    name: "Ana Garcia",
    storeName: "Ana's",
    email: "ana@vendor4.com",
    phone: "+63 920 456 7890",
    location: "Tandubas, Tawi Tawi",
    assignedVouchers: 950,
    activatedVouchers: 850,
    status: "Active",
    joinedDate: "2025-03-01",
  },
];

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    // 2. The URL is now relative, and headers are handled automatically
    axiosInstance
      .get("http://121.58.249.168:3033/api/distributor/2/sellers")
      .then((res) => {
        const dataToSet = Array.isArray(res.data) ? res.data : res.data.sellers;
        if (Array.isArray(dataToSet)) {
          setSellers(dataToSet);
        } else {
          console.error("❌ Unexpected API structure:", res.data);
          setSellers([]);
        }
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
        setSellers([]);
      });
  }, []);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const filtered = sellers.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (seller: Seller) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.sellerId === seller.sellerId
          ? {
              ...s,
              status: s.status === "Active" ? "Inactive" : "Active",
            }
          : s,
      ),
    );
    setSelectedSeller(null);
  };

  // const handleToggleStatus = (vendor: Vendor) => {
  //   setVendors((prev) =>
  //     prev.map((v) =>
  //       v.id === vendor.id
  //         ? { ...v, status: v.status === "Active" ? "Inactive" : "Active" }
  //         : v,
  //     ),
  //   );
  //   setSelectedVendor(null);
  // };

  const handleAddSeller = (
    data: { name: string; email: string; phone: string; location: string },
    assignments: Record<string, number>,
  ) => {
    const total = Object.values(assignments).reduce((s, q) => s + q, 0);

    const newSeller: Seller = {
      sellerId: sellers.length + 1,
      fullName: data.name,
      storeName: `${data.name.split(" ")[0]}'s Store`,
      email: data.email,
      phone: data.phone,
      location: data.location,
      assignedVouchers: total,
      activatedVouchers: 0,
      lastLoginAt: null,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setSellers((prev) => [...prev, newSeller]);
    setShowAddModal(false);

    toast.success(`Seller ${data.name} added successfully`);
  };

  const handleEditSeller = (updated: Seller) => {
    setSellers((prev) =>
      prev.map((s) => (s.sellerId === updated.sellerId ? updated : s)),
    );
    setSelectedSeller(updated);
  };

  const handleAddVendor = (
    data: { name: string; email: string; phone: string; location: string },
    assignments: Record<string, number>,
  ) => {
    const total = Object.values(assignments).reduce((s, q) => s + q, 0);
    const newVendor: Vendor = {
      id: String(vendors.length + 1),
      name: data.name,
      storeName: `${data.name.split(" ")[0]}'s Store`,
      email: data.email,
      phone: data.phone,
      location: data.location,
      assignedVouchers: total,
      activatedVouchers: 0,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setVendors((prev) => [...prev, newVendor]);
    setShowAddModal(false);
    toast.custom(() => (
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-[#008A2E] flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
        <div
          className="text-[13px] leading-[19.5px]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <span className="text-[#008A2E] font-medium">Vendor </span>
          <span className="text-[#008A2E] font-bold">{data.name}</span>
          <span className="text-[#008A2E] font-medium">
            {" "}
            added successfully!
          </span>
        </div>
      </div>
    ));
  };

  const handleEditVendor = (updatedVendor: Vendor) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v)),
    );
    setSelectedVendor(updatedVendor);
  };

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Vendor Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage your sellers and their access
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2  bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors w-fit"
          >
            <Plus size={20} /> Add Vendor
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Vendors",
              value: vendors.length,
              color: "text-slate-900 dark:text-white",
            },
            {
              label: "Active",
              value: vendors.filter((v) => v.status === "Active").length,
              color: "text-green-600 dark:text-green-400",
            },
            {
              label: "Inactive",
              value: vendors.filter((v) => v.status === "Inactive").length,
              color: "text-red-600 dark:text-red-400",
            },
            {
              label: "Total Assigned",
              value: vendors
                .reduce((s, v) => s + v.assignedVouchers, 0)
                .toLocaleString(),
              color: "text-slate-900 dark:text-white",
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {card.label}
              </div>
              <div className={cn("text-3xl font-bold", card.color)}>
                {card.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              {(["All", "Active", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors text-sm",
                    statusFilter === s
                      ? "bg-teal-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  {[
                    "Vendor",
                    "Store Name",
                    "Activated Vouchers",
                    "Location",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map((s) => (
                  <tr
                    key={s.sellerId}
                    // onClick={() => setSelectedVendor(s)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                          <User
                            className="text-teal-600 dark:text-teal-400"
                            size={20}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {s.fullName}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Joined {s.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Store
                          className="text-teal-600 dark:text-teal-400"
                          size={16}
                        />
                        <div className="text-slate-900 dark:text-white">
                          {s.storeName}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Ticket
                          className="text-teal-600 dark:text-teal-400"
                          size={16}
                        />
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {s.activatedVouchers.toLocaleString()}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" />
                        {s.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                          s.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Vendor Details Modal */}
        <AnimatePresence>
          {selectedVendor && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedVendor(null)}
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
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                          <User className="text-white" size={32} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {selectedVendor.name}
                          </h2>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                                selectedVendor.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                              )}
                            >
                              {selectedVendor.status}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              • Joined {selectedVendor.joinedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedVendor(null)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <X
                          size={24}
                          className="text-slate-500 dark:text-slate-400"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)] space-y-8">
                    <section>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                        Store & Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="rounded-xl border border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-4 dark:border-cyan-900/50 dark:from-cyan-900/20 dark:to-cyan-800/10">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800">
                              <Package className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                                Store Name
                              </p>
                              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                {selectedVendor.name.split(" ")[0]}&apos;s Store
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {[
                            {
                              icon: Mail,
                              label: "Email Address",
                              value: selectedVendor.email,
                            },
                            {
                              icon: Phone,
                              label: "Phone Number",
                              value: selectedVendor.phone,
                            },
                          ].map(({ icon: Icon, label, value }) => (
                            <div
                              key={label}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/30"
                            >
                              <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800">
                                  <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {label}
                                  </p>
                                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                    {value}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/30">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800">
                              <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Location
                              </p>
                              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                                {selectedVendor.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                        Plan Sales Breakdown
                      </h3>
                      <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/10">
                          <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                            Total Sold
                          </p>
                          <p className="mt-3 text-3xl font-bold text-blue-900 dark:text-blue-100">
                            {selectedVendor.assignedVouchers.toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-300">
                            vouchers
                          </p>
                        </div>
                        <div className="rounded-2xl border border-green-300 bg-gradient-to-br from-green-50 to-green-100/50 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/10">
                          <p className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-300">
                            Total Activated
                          </p>
                          <p className="mt-3 text-3xl font-bold text-green-900 dark:text-green-100">
                            {selectedVendor.activatedVouchers.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-300">
                            vouchers
                          </p>
                        </div>
                        <div className="rounded-2xl border border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100/50 p-5 dark:border-teal-900/50 dark:from-teal-900/20 dark:to-teal-800/10">
                          <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                            Activation Rate
                          </p>
                          <p className="mt-3 text-3xl font-bold text-teal-900 dark:text-teal-100">
                            {(
                              (selectedVendor.activatedVouchers /
                                selectedVendor.assignedVouchers) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                          <p className="text-xs text-teal-600 dark:text-teal-300">
                            efficiency
                          </p>
                        </div>
                      </div>

                      {/* Plan Sales Table */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                PLAN NAME
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                DATA/VOUCHER
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                QTY SOLD
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                QTY ACTIVATED
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                TOTAL GB
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {mockPlanSales.map((sale, index) => (
                              <tr
                                key={index}
                                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                  {sale.planName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 text-teal-700 font-semibold">
                                    <Package size={14} />
                                    {sale.dataVoucher}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                  {sale.qtySold.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                  {sale.qtyActivated.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-teal-600 text-white font-bold text-sm">
                                    {sale.totalGb.toLocaleString()} GB
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {/* Total Row */}
                            <tr className="bg-slate-50 dark:bg-slate-700/50 font-semibold">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                TOTAL
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                                -
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                {mockPlanSales
                                  .reduce((sum, sale) => sum + sale.qtySold, 0)
                                  .toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                {mockPlanSales
                                  .reduce(
                                    (sum, sale) => sum + sale.qtyActivated,
                                    0,
                                  )
                                  .toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-teal-600 text-white font-bold text-sm">
                                  {mockPlanSales
                                    .reduce(
                                      (sum, sale) => sum + sale.totalGb,
                                      0,
                                    )
                                    .toLocaleString()}{" "}
                                  GB
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>

                  {/* Modal Actions */}
                  <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowEditDialog(true)}
                        className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/30"
                      >
                        <Edit size={20} /> Edit Vendor
                      </button>
                      <button
                        onClick={() => setSelectedVendor(null)}
                        className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30"
                      >
                        <RotateCcw size={20} /> Reset Password
                      </button>
                      <button
                        onClick={() => handleToggleStatus(selectedSeller!)}
                        className={cn(
                          "flex-1 px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg",
                          selectedVendor.status === "Active"
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30",
                        )}
                      >
                        <Power size={20} />
                        {selectedVendor.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Add Vendor Modal */}
        {/* <AddVendorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          plans={mockPlans}
          onSubmit={handleAddVendor}
        /> */}

        {/* Edit Vendor Dialog */}
        <EditVendorDialog
          key={selectedVendor?.id}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          vendor={selectedVendor}
          onSave={handleEditVendor}
        />
      </div>
    </>
  );
}
