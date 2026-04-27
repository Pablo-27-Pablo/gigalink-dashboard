"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Printer, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { Layout } from "@/components/Layout";

const services = [
  {
    id: 1,
    name: "Basic Plan",
    price: "$9.99",
    data: "1GB",
    validity: "1 Day",
    features: ["1GB Data", "30 Days Validity", "Standard Support"],
    quota: 250,
    popular: false,
  },
  {
    id: 2,
    name: "Standard Plan",
    price: "$19.99",
    data: "2GB",
    validity: "3 Days",
    features: ["2GB Data", "3 Days Validity", "Priority Support", "Email Support"],
    quota: 150,
    popular: false,
  },
  {
    id: 3,
    name: "Premium Plan",
    price: "0.00",
    data: "5GB",
    validity: "15 Days",
    features: ["5GB Data", "15 Days Validity", "Priority Support", "Data Rollover"],
    quota: 100,
    popular: true,
  },
  {
    id: 4,
    name: "Giga Plan",
    price: "$49.99",
    data: "10GB",
    validity: "30 Days",
    features: ["10GB Data", "30 Days Validity", "24/7 Support", "Hotspot Included"],
    quota: 50,
    popular: false,
  },
];

interface Voucher {
  code: string;
  plan: string;
  price: string;
  data: string;
  validity: string;
  generatedAt: string;
}

export function Services() {
  const [selectedPlan, setSelectedPlan] = useState<typeof services[0] | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedVouchers, setGeneratedVouchers] = useState<Voucher[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);

  const handlePlanClick = (service: typeof services[0]) => {
    setSelectedPlan(service);
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

  const handleGenerateVouchers = () => {
    if (!selectedPlan) return;
    const voucher: Voucher = {
      code: generateVoucherCode(),
      plan: selectedPlan.name,
      price: selectedPlan.price,
      data: selectedPlan.data,
      validity: selectedPlan.validity,
      generatedAt: new Date().toLocaleString(),
    };
    setGeneratedVouchers([voucher]);
    setShowConfirmation(false);
    setShowVouchers(true);
  };

  const handleCopyVoucher = (code: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
    textArea.remove();
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
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Services</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Choose the best data plan that suits your needs. Click to generate QR Code.
          </p>
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handlePlanClick(service)}
              className={cn(
                "relative rounded-2xl border shadow-sm flex flex-col cursor-pointer transition-all hover:shadow-xl hover:scale-[1.03] overflow-hidden",
                service.popular ? "border-teal-500 ring-2 ring-teal-400/60" : "border-slate-200 dark:border-slate-700",
                "bg-white dark:bg-slate-800"
              )}
            >
              <div className={cn("h-1.5 w-full", service.popular ? "bg-teal-500" : "bg-slate-200 dark:bg-slate-700")} />

              {service.popular && (
                <span className="absolute top-3 right-3 bg-teal-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide shadow">
                  Popular
                </span>
              )}

              <div className="p-6 flex flex-col flex-1 gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-1">Plan</p>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-semibold">
                    {service.data}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                    {service.validity}
                  </span>
                </div>

                <div className={cn(
                  "rounded-xl p-4 flex flex-col gap-2",
                  service.popular
                    ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800"
                    : "bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700"
                )}>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    <span>Remaining Quota</span>
                    <span className={cn(
                      "font-bold text-base",
                      service.quota <= 50 ? "text-red-500" : service.quota <= 150 ? "text-amber-500" : "text-teal-600 dark:text-teal-400"
                    )}>
                      {service.quota}<span className="text-slate-400 font-normal text-xs">/250</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        service.quota <= 50 ? "bg-red-500" : service.quota <= 150 ? "bg-amber-400" : "bg-teal-500"
                      )}
                      style={{ width: `${(service.quota / 250) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {service.quota <= 50 ? "⚠️ Low quota remaining" : service.quota <= 150 ? "Moderate availability" : "Plenty available"}
                  </p>
                </div>

                <button className={cn(
                  "mt-auto w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors",
                  service.popular
                    ? "bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/30"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 text-slate-900 dark:text-white"
                )}>
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowConfirmation(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="h-1.5 w-full bg-teal-500" />
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-0.5">Confirm</p>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Generate Voucher</h2>
                    </div>
                    <button onClick={() => setShowConfirmation(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Plan Name</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedPlan.name}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-3 rounded-xl">
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium uppercase tracking-wide">Data</p>
                        <p className="font-bold text-teal-700 dark:text-teal-300">{selectedPlan.data}</p>
                      </div>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 p-3 rounded-xl">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Valid For</p>
                        <p className="font-bold text-slate-800 dark:text-white">{selectedPlan.validity}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border",
                      selectedPlan.quota <= 50 ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                        : selectedPlan.quota <= 150 ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                        : "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Remaining Quota</p>
                        <span className={cn("font-bold text-lg",
                          selectedPlan.quota <= 50 ? "text-red-500" : selectedPlan.quota <= 150 ? "text-amber-500" : "text-teal-600 dark:text-teal-400"
                        )}>
                          {selectedPlan.quota}<span className="text-slate-400 font-normal text-xs">/250</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", selectedPlan.quota <= 50 ? "bg-red-500" : selectedPlan.quota <= 150 ? "bg-amber-400" : "bg-teal-500")}
                          style={{ width: `${(selectedPlan.quota / 250) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowConfirmation(false)} className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-medium transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleGenerateVouchers} className="flex-1 py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors shadow-md shadow-teal-500/30">
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowVouchers(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 my-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generated Vouchers</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {generatedVouchers.length} voucher{generatedVouchers.length > 1 ? "s" : ""} created successfully
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handlePrintVoucher} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors" title="Print">
                      <Printer size={20} className="text-slate-700 dark:text-slate-300" />
                    </button>
                    <button onClick={() => setShowVouchers(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <X size={20} className="text-slate-500 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
                  {generatedVouchers.map((voucher, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 p-6 rounded-xl border-2 border-teal-200 dark:border-teal-800"
                    >
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg mb-4">
                          <QRCodeSVG
                            id={`qr-${voucher.code}`}
                            value={`VOUCHER:${voucher.code}|PLAN:${voucher.plan}|PRICE:${voucher.price}`}
                            size={160}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <div className="w-full space-y-3">
                          <div className="bg-white dark:bg-slate-900/50 p-3 rounded-lg">
                            <div className="text-xs text-slate-500 mb-1">Voucher Code</div>
                            <div className="font-mono text-lg font-bold text-slate-900 dark:text-white break-all">{voucher.code}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white dark:bg-slate-900/50 p-2 rounded-lg">
                              <div className="text-xs text-slate-500">Plan</div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">{voucher.plan}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-2 rounded-lg">
                              <div className="text-xs text-slate-500">Price</div>
                              <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">{voucher.price}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-2 rounded-lg">
                              <div className="text-xs text-slate-500">Data</div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">{voucher.data}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-2 rounded-lg">
                              <div className="text-xs text-slate-500">Validity</div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">{voucher.validity}</div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 text-center">Generated: {voucher.generatedAt}</div>
                        </div>
                        <div className="flex gap-2 mt-4 w-full">
                          <button
                            onClick={() => handleCopyVoucher(voucher.code)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-600"
                          >
                            <Copy size={14} /> Copy
                          </button>
                          <button
                            onClick={() => handleDownloadQR(voucher.code)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors"
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
    </Layout>
  );
}
