"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Printer, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import Cookies from "js-cookie";
import axiosInstance from "../../../../../../components/axios/axios";
import { toast } from "sonner";

interface Plan {
  profileName: string;
  totalOwned: number;
  activatedCount: number;
  availableCount: number;
}

interface ServiceData {
  sellerId: number;
  distributorId: number;
  plans: Plan[];
}

interface Voucher {
  code: string;
  plan: string;
  price: string;
  data: string;
  validity: string;
  generatedAt: string;
}

export default function Services() {
  // Fix: Reference the Interface directly instead of the state variable to avoid initialization errors
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedVouchers, setGeneratedVouchers] = useState<Voucher[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);

  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const generateVoucherCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3 || i === 7) code += "-";
    }
    return code;
  };

  // Add this state at the top of your component with your other states
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVouchers = async () => {
    if (!selectedPlan) return;

    setIsGenerating(true);
    const toastId = toast.loading("Generating voucher...");
    try {
      const sessionToken = Cookies.get("session2");
      const sessionSellerID = Cookies.get("vendorId");

      const response = await axiosInstance.post(
        `api/seller/${sessionSellerID}/services/generate`,
        {
          profileName: selectedPlan.profileName,
        },
        {
          headers: {
            ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
          },
        },
      );

      const data = response.data;
      fetchServiceData(); // Refresh the service data to update inventory counts

      // Map the API response to your Voucher interface
      // Note: Using data.voucher.username for the code based on your JSON
      const newVoucher: Voucher = {
        code: data.voucher?.username || "ERROR-NO-CODE",
        plan: data.profileName || selectedPlan.profileName,
        price: "Standard", // Set default or pull from data if available
        data: "N/A",
        validity: "Standard",
        generatedAt: new Date().toLocaleString(),
      };

      setGeneratedVouchers([newVoucher]);
      setShowConfirmation(false);
      setShowVouchers(true);
      toast.success("Voucher generated successfully", { id: toastId });
    } catch (error) {
      console.error("❌ Failed to generate voucher:", error);
      toast.error(
        "Failed to generate voucher. Please check your connection or permissions.",
        { id: toastId },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success("Voucher code copied"))
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy voucher code");
      });
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  const handleDownloadQR = (code: string) => {
    const svg = document.getElementById(`qr-${code}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `voucher-${code}.png`;
        link.href = pngFile;
        link.click();
        toast.success("QR code downloaded");
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } else {
      toast.error("QR code is not ready to download");
    }
  };

  const fetchServiceData = async () => {
    const sessionToken = Cookies.get("session2");
    const sessionSellerID = Cookies.get("vendorId");
    axiosInstance
      .get(`api/seller/${sessionSellerID}/inventory-summary`, {
        headers: {
          ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        },
      })
      .then((res) => {
        console.log("API Response:", res.data);
        setServiceData(res.data);
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
        toast.error("Failed to load service data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const sessionToken = Cookies.get("session2");
    const sessionSellerID = Cookies.get("sellerId");

    setLoading(true);
    fetchServiceData();
  }, []);

  // Prevent crashes if data is still loading
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  if (!serviceData) {
    return <div className="p-6 text-center">No service data available.</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Our Services
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Choose the best data plan from Seller ID: {serviceData.sellerId}.
          Click to generate QR Code.
        </p>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {serviceData.plans?.map((plan, index) => (
          <motion.div
            key={plan.profileName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handlePlanClick(plan)}
            className={cn(
              "relative rounded-2xl border shadow-sm flex flex-col cursor-pointer transition-all hover:shadow-xl hover:scale-[1.03] overflow-hidden",
              plan.profileName.includes("Premium")
                ? "border-teal-500 ring-2 ring-teal-400/60"
                : "border-slate-200 dark:border-slate-700",
              "bg-white dark:bg-slate-800",
            )}
          >
            <div
              className={cn(
                "h-1.5 w-full",
                plan.profileName.includes("Premium")
                  ? "bg-teal-500"
                  : "bg-slate-200 dark:bg-slate-700",
              )}
            />

            {plan.profileName.includes("Premium") && (
              <span className="absolute top-3 right-3 bg-teal-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide shadow">
                Popular
              </span>
            )}

            <div className="p-6 flex flex-col flex-1 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-1">
                  Plan
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {plan.profileName}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold">
                  {plan.totalOwned} Total
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                  {plan.activatedCount} Activated
                </span>
              </div>

              <div
                className={cn(
                  "rounded-xl p-4 flex flex-col gap-2",
                  plan.profileName.includes("Premium")
                    ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800"
                    : "bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700",
                )}
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <span>Available Inventory</span>
                  <span
                    className={cn(
                      "font-bold text-base",
                      plan.availableCount <= 5
                        ? "text-red-500"
                        : plan.availableCount <= 8
                          ? "text-amber-500"
                          : "text-teal-600 dark:text-teal-400",
                    )}
                  >
                    {plan.availableCount}
                    <span className="text-slate-400 font-normal text-xs">
                      /{plan.totalOwned}
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      plan.availableCount <= 5
                        ? "bg-red-500"
                        : plan.availableCount <= 8
                          ? "bg-amber-400"
                          : "bg-teal-500",
                    )}
                    style={{
                      width: `${(plan.availableCount / plan.totalOwned) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className={cn(
                  "mt-auto w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors",
                  plan.profileName.includes("Premium")
                    ? "bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/30"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 text-slate-900 dark:text-white",
                )}
              >
                Generate QR Code
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="h-1.5 w-full bg-teal-500" />
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-0.5">
                      Confirm
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Generate Voucher
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
                      Plan Name
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedPlan.profileName}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 p-3 rounded-xl">
                      <p className="text-xs text-teal-600 font-medium">
                        Available
                      </p>
                      <p className="font-bold">{selectedPlan.availableCount}</p>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700/60 p-3 rounded-xl">
                      <p className="text-xs text-slate-500 font-medium">
                        Total Owned
                      </p>
                      <p className="font-bold">{selectedPlan.totalOwned}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateVouchers}
                    className="flex-1 py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold shadow-md"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Vouchers Modal */}
      <AnimatePresence>
        {showVouchers && generatedVouchers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowVouchers(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Generated Vouchers
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrintVoucher}
                    className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
                  >
                    <Printer
                      size={20}
                      className="text-slate-700 dark:text-slate-300"
                    />
                  </button>
                  <button
                    onClick={() => setShowVouchers(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedVouchers.map((voucher, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 p-6 rounded-xl border-2 border-teal-200 dark:border-teal-800"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <QRCodeSVG
                          id={`qr-${voucher.code}`}
                          value={`https://gigaportal.comclark.com/login.html?voucher=${voucher.code}`}
                          size={160}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div className="w-full space-y-3">
                        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-lg text-center">
                          <div className="text-xs text-slate-500 mb-1">
                            Voucher Code
                          </div>
                          <div className="font-mono text-lg font-bold">
                            {voucher.code}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 text-center">
                          Generated: {voucher.generatedAt}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 w-full">
                        <button
                          onClick={() => handleCopyVoucher(voucher.code)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-white dark:bg-slate-700 rounded-lg text-sm border border-slate-200"
                        >
                          <Copy size={14} /> Copy
                        </button>
                        <button
                          onClick={() => handleDownloadQR(voucher.code)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-teal-500 text-white rounded-lg text-sm"
                        >
                          <Download size={14} /> QR
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
