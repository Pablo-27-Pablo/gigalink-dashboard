"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Package,
  Store,
  Ticket,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
//import { AddVendorModal } from "@/components/dashboard/modal/AddVendorModal";
import { EditVendorDialog } from "@/components/Distributor/EditVendorDialog";
import { toast } from "sonner";

/* =========================
   ✅ SINGLE SOURCE: SELLER
========================= */
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

/* =========================
   MOCK DATA (UPDATED)
========================= */

/* =========================
   COMPONENT
========================= */
export default function VendorManagement() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filtered = sellers.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* =========================
     ACTIONS
  ========================= */

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

  /* =========================
     UI
  ========================= */

  return (
    <>
      <div className="space-y-6 p-6">
        {/* HEADER */}
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg flex gap-2"
          >
            <Plus size={20} /> Add Vendor
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2">
          <input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Store</th>
              <th>Activated</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.sellerId}
                onClick={() => setSelectedSeller(s)}
                className="cursor-pointer"
              >
                <td>{s.fullName}</td>
                <td>{s.storeName}</td>
                <td>{s.activatedVouchers}</td>
                <td>{s.location}</td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL */}
        <AnimatePresence>
          {selectedSeller && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                  {selectedSeller.fullName}
                </h2>

                <p>Email: {selectedSeller.email}</p>
                <p>Phone: {selectedSeller.phone}</p>
                <p>Location: {selectedSeller.location}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleToggleStatus(selectedSeller)}
                    className="bg-red-500 text-white px-3 py-2 rounded"
                  >
                    Toggle Status
                  </button>
                </div>

                <button
                  onClick={() => setSelectedSeller(null)}
                  className="mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* MODALS */}
        {/* <AddVendorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          plans={[]}
          onSubmit={handleAddSeller}
        /> */}

        {/* <EditVendorDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          vendor={selectedSeller}
          onSave={handleEditSeller}
        /> */}
      </div>
    </>
  );
}
