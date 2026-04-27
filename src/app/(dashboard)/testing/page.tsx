"use client";

import { useState, useEffect } from "react"; // ✅ added useEffect
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
import { AddVendorModal } from "@/components/dashboard/modal/AddVendorModal";
import { EditVendorDialog } from "@/components/Distributor/EditVendorDialog";
import { toast } from "sonner";
import axios from "axios"; // ✅ added
import Cookies from "js-cookie"; // ✅ added

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
  status: "Active" | "Inactive";
  joinedDate: string;
}

/* =========================
   API RESPONSE
========================= */
interface ApiResponse {
  distributorId: number;
  sellers: Omit<Seller, "status" | "joinedDate">[];
}

/* =========================
   MOCK DATA (UNCHANGED)
========================= */
const initialSellers: Seller[] = [
  {
    sellerId: 1,
    fullName: "Juan Dela Cruz",
    storeName: "A&J",
    email: "juan@vendor1.com",
    phone: "+63 917 123 4567",
    location: "Bongao, Tawi Tawi",
    assignedVouchers: 1500,
    activatedVouchers: 1350,
    lastLoginAt: null,
    status: "Active",
    joinedDate: "2025-01-15",
  },
];

/* =========================
   COMPONENT
========================= */
export default function VendorManagement() {
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [loading, setLoading] = useState(true); // ✅ added
  const [error, setError] = useState<string | null>(null); // ✅ added

  /* =========================
     ✅ FETCH FROM API
  ========================= */
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const tokens = Cookies.get("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<ApiResponse>(
          "http://121.58.249.168:3033/api/distributor/2/sellers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        // ✅ MAP API DATA → YOUR UI STRUCTURE
        const mappedSellers: Seller[] = response.data.sellers.map((s) => ({
          ...s,
          status: "Active", // default (since API doesn't provide)
          joinedDate: new Date().toISOString().split("T")[0], // default
        }));

        setSellers(mappedSellers);
      } catch (err: any) {
        console.error("❌ Fetch Error:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to fetch",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filtered = sellers.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* =========================
     ACTIONS (UNCHANGED)
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
        {/* LOADING */}
        {loading && <p>Loading sellers...</p>}
        {error && <p className="text-red-500">{error}</p>}

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
        <AddVendorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          plans={[]}
          onSubmit={handleAddSeller}
        />

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
