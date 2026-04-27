"use client";

import { useState } from "react";
import { Check, Clock, X, Printer, Copy, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Plan {
  id: string;
  name: string;
  data: string;
  duration: string;
  remaining: number;
  total: number;
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    data: "1 GB",
    duration: "01 Day",
    remaining: 250,
    total: 250,
  },
  {
    id: "standard",
    name: "Standard Plan",
    data: "2 GB",
    duration: "03 Days",
    remaining: 150,
    total: 250,
  },
  {
    id: "premium",
    name: "Premium Plan",
    data: "5 GB",
    duration: "15 Days",
    remaining: 100,
    total: 250,
    isPopular: true,
  },
  {
    id: "giga",
    name: "Giga Plan",
    data: "10 GB",
    duration: "30 Days",
    remaining: 50,
    total: 250,
  },
];

function getQuotaColor(
  remaining: number,
  total: number,
  theme: "light" | "dark",
): { bar: string; text: string; status: string; statusColor: string } {
  const percentage = (remaining / total) * 100;

  if (percentage >= 80) {
    return {
      bar: "bg-[#00BBA7]",
      text: theme === "dark" ? "text-[#00D5BE]" : "text-teal-600",
      status: "Plenty available",
      statusColor: theme === "dark" ? "text-[#62748E]" : "text-slate-500",
    };
  } else if (percentage >= 40) {
    return {
      bar: "bg-[#FFB900]",
      text: theme === "dark" ? "text-[#FE9A00]" : "text-amber-500",
      status: "Moderate availability",
      statusColor: theme === "dark" ? "text-[#62748E]" : "text-slate-500",
    };
  } else {
    return {
      bar: "bg-[#FB2C36]",
      text: theme === "dark" ? "text-[#FB2C36]" : "text-red-500",
      status: "⚠️ Low number of plan remaining",
      statusColor: theme === "dark" ? "text-[#62748E]" : "text-slate-500",
    };
  }
}

interface GenerateModalProps {
  plan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: "light" | "dark";
}

function GenerateModal({
  plan,
  isOpen,
  onClose,
  onConfirm,
  theme,
}: GenerateModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !plan) return null;

  const quotaColors = getQuotaColor(plan.remaining, plan.total, theme);
  const percentage = (plan.remaining / plan.total) * 100;

  const handleConfirm = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden",
          theme === "dark"
            ? "bg-[#1D293D] border-[#314158]"
            : "bg-white border-slate-200",
        )}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#00BBA7]" />

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <div
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  theme === "dark" ? "text-[#00BBA7]" : "text-teal-600",
                )}
              >
                Confirm
              </div>
              <h2
                className={cn(
                  "text-xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                Generate Voucher
              </h2>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-lg transition-colors",
                theme === "dark"
                  ? "hover:bg-[#314158] text-[#90A1B9]"
                  : "hover:bg-slate-100 text-slate-500",
              )}
            >
              <X size={20} />
            </button>
          </div>

          {/* Plan Details */}
          <div className="space-y-3">
            {/* Plan Name */}
            <div
              className={cn(
                "rounded-xl p-4 space-y-1",
                theme === "dark" ? "bg-[rgba(15,23,43,0.5)]" : "bg-slate-100",
              )}
            >
              <div
                className={cn(
                  "text-xs font-medium uppercase tracking-wider",
                  theme === "dark" ? "text-[#62748E]" : "text-slate-500",
                )}
              >
                Plan Name
              </div>
              <div
                className={cn(
                  "text-lg font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {plan.name}
              </div>
            </div>

            {/* Data & Duration */}
            <div className="grid grid-cols-2 gap-3">
              {/* Data */}
              <div
                className={cn(
                  "rounded-xl p-3 flex items-center gap-2 border",
                  theme === "dark"
                    ? "bg-[rgba(11,79,74,0.2)] border-[#005F5A]"
                    : "bg-teal-50 border-teal-200",
                )}
              >
                <Check
                  size={16}
                  className={cn(
                    theme === "dark" ? "text-[#00BBA7]" : "text-teal-500",
                  )}
                />
                <div>
                  <div
                    className={cn(
                      "text-xs font-medium uppercase tracking-wider",
                      theme === "dark" ? "text-[#00D5BE]" : "text-teal-600",
                    )}
                  >
                    Data
                  </div>
                  <div
                    className={cn(
                      "text-base font-bold",
                      theme === "dark" ? "text-[#46ECD5]" : "text-teal-600",
                    )}
                  >
                    {plan.data}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div
                className={cn(
                  "rounded-xl p-3 flex items-center gap-2 border",
                  theme === "dark"
                    ? "bg-[rgba(49,65,88,0.6)] border-[#45556C]"
                    : "bg-slate-100 border-slate-200",
                )}
              >
                <Clock
                  size={16}
                  className={cn(
                    theme === "dark" ? "text-[#90A1B9]" : "text-slate-400",
                  )}
                />
                <div>
                  <div
                    className={cn(
                      "text-xs font-medium uppercase tracking-wider",
                      theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                    )}
                  >
                    Valid For
                  </div>
                  <div
                    className={cn(
                      "text-base font-bold",
                      theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    {plan.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Quota Info */}
            <div
              className={cn(
                "rounded-xl p-4 space-y-3 border",
                theme === "dark"
                  ? "bg-[rgba(123,51,6,0.1)] border-[#973C00]"
                  : "bg-amber-50 border-amber-200",
              )}
            >
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                  )}
                >
                  Remaining Quota
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className={cn("text-lg font-bold", quotaColors.text)}>
                    {plan.remaining}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-[#62748E]" : "text-slate-400",
                    )}
                  >
                    /{plan.total}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "h-2 rounded-full overflow-hidden",
                  theme === "dark" ? "bg-[#45556C]" : "bg-slate-300",
                )}
              >
                <div
                  className={cn("h-full rounded-full", quotaColors.bar)}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className={cn("text-xs", quotaColors.statusColor)}>
                {quotaColors.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl font-medium text-base transition-all duration-200",
                theme === "dark"
                  ? "bg-[#314158] text-white hover:bg-[#3d526e]"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300",
                isGenerating && "opacity-60 cursor-not-allowed",
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isGenerating || plan.remaining === 0}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-200",
                "bg-[#00BBA7] text-white shadow-[0_2px_4px_-2px_rgba(0,187,167,0.3),0_4px_6px_-1px_rgba(0,187,167,0.3)]",
                "hover:bg-[#00A896] active:scale-[0.98]",
                (isGenerating || plan.remaining === 0) &&
                  "opacity-60 cursor-not-allowed",
              )}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  theme: "light" | "dark";
}

function SuccessModal({ isOpen, onClose, plan, theme }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !plan) return null;

  const voucherCode = "AX9921BZ";
  const generatedAt = new Date().toLocaleString();

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden",
          theme === "dark"
            ? "bg-[#1D293D] border-[#314158]"
            : "bg-white border-slate-200",
        )}
      >
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h2
                className={cn(
                  "text-2xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                Generated Vouchers
              </h2>
              <p
                className={cn(
                  "text-sm",
                  theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                )}
              >
                1 voucher created successfully
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark"
                    ? "bg-[#314158] text-[#CAD5E2] hover:bg-[#45556C]"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300",
                )}
              >
                <Printer size={18} />
              </button>
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === "dark"
                    ? "hover:bg-[#314158] text-[#90A1B9]"
                    : "hover:bg-slate-100 text-slate-500",
                )}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Voucher Card */}
          <div
            className={cn(
              "rounded-xl p-6 space-y-4 border",
              theme === "dark"
                ? "bg-gradient-to-br from-[rgba(11,79,74,0.2)] to-[rgba(11,79,74,0.1)] border-[#005F5A]"
                : "bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200",
            )}
          >
            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white rounded-lg p-4 shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center">
                  <QrCode size={80} className="text-white" />
                </div>
              </div>
            </div>

            {/* Voucher Details */}
            <div className="space-y-3">
              {/* Voucher Code */}
              <div
                className={cn(
                  "rounded-lg p-3 space-y-1",
                  theme === "dark" ? "bg-[rgba(15,23,43,0.5)]" : "bg-white/70",
                )}
              >
                <div
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                  )}
                >
                  Voucher Code
                </div>
                <div
                  className={cn(
                    "text-lg font-bold font-mono",
                    theme === "dark" ? "text-white" : "text-slate-900",
                  )}
                >
                  {voucherCode}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={cn(
                    "rounded-lg p-2 space-y-0.5",
                    theme === "dark"
                      ? "bg-[rgba(15,23,43,0.5)]"
                      : "bg-white/70",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                    )}
                  >
                    Plan
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold",
                      theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    {plan.name}
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-lg p-2 space-y-0.5",
                    theme === "dark"
                      ? "bg-[rgba(15,23,43,0.5)]"
                      : "bg-white/70",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                    )}
                  >
                    Price
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold",
                      theme === "dark" ? "text-[#00D5BE]" : "text-teal-600",
                    )}
                  >
                    $29.99
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-lg p-2 space-y-0.5",
                    theme === "dark"
                      ? "bg-[rgba(15,23,43,0.5)]"
                      : "bg-white/70",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                    )}
                  >
                    Data
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold",
                      theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    {plan.data}
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-lg p-2 space-y-0.5",
                    theme === "dark"
                      ? "bg-[rgba(15,23,43,0.5)]"
                      : "bg-white/70",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                    )}
                  >
                    Validity
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold",
                      theme === "dark" ? "text-white" : "text-slate-900",
                    )}
                  >
                    {plan.duration}
                  </div>
                </div>
              </div>

              {/* Generated Time */}
              <div
                className={cn(
                  "text-xs text-center",
                  theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
                )}
              >
                Generated: {generatedAt}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 border",
                  copied
                    ? "bg-green-500 text-white border-green-500"
                    : theme === "dark"
                      ? "bg-[#314158] text-[#E2E8F0] border-[#45556C] hover:bg-[#45556C]"
                      : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300",
                )}
              >
                <Copy size={14} />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2",
                  "bg-[#00BBA7] text-white hover:bg-[#00A896]",
                )}
              >
                <QrCode size={14} />
                QR
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  theme: "light" | "dark";
  onGenerate: (plan: Plan) => void;
}

function PlanCard({ plan, theme, onGenerate }: PlanCardProps) {
  const quotaColors = getQuotaColor(plan.remaining, plan.total, theme);
  const percentage = (plan.remaining / plan.total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border shadow-sm overflow-hidden relative",
        plan.isPopular
          ? theme === "dark"
            ? "bg-[#1D293D] border-[#00BBA7] shadow-[0_0_0_2px_rgba(0,213,190,0.6)]"
            : "bg-white border-teal-500 shadow-[0_0_0_2px_rgba(20,184,166,0.3)]"
          : theme === "dark"
            ? "bg-[#1D293D] border-[#314158]"
            : "bg-white border-slate-200",
      )}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          "h-1.5 w-full",
          plan.isPopular
            ? "bg-[#00BBA7]"
            : theme === "dark"
              ? "bg-[#314158]"
              : "bg-slate-300",
        )}
      />

      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute top-3 right-4 bg-[#00BBA7] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          Popular
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Plan Header */}
        <div className="space-y-1">
          <div
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              theme === "dark" ? "text-[#00BBA7]" : "text-teal-600",
            )}
          >
            Plan
          </div>
          <h3
            className={cn(
              "text-xl font-bold",
              theme === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            {plan.name}
          </h3>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2.5">
          {/* Data badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
              theme === "dark"
                ? "border-[rgba(11,79,74,0.3)]"
                : "border-teal-200",
            )}
          >
            <Check
              size={14}
              className={cn(
                theme === "dark" ? "text-[#46ECD5]" : "text-teal-500",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                theme === "dark" ? "text-[#46ECD5]" : "text-teal-600",
              )}
            >
              {plan.data}
            </span>
          </div>

          {/* Duration badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
              theme === "dark"
                ? "border-[#314158] bg-[#1D293D]"
                : "border-slate-300 bg-slate-50",
            )}
          >
            <Clock
              size={14}
              className={cn(
                theme === "dark" ? "text-[#CAD5E2]" : "text-slate-400",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                theme === "dark" ? "text-[#CAD5E2]" : "text-slate-600",
              )}
            >
              {plan.duration}
            </span>
          </div>
        </div>

        {/* Quota Section */}
        <div
          className={cn(
            "rounded-xl p-4 space-y-3",
            plan.isPopular && theme === "dark"
              ? "bg-[rgba(11,79,74,0.2)] border border-[#005F5A]"
              : theme === "dark"
                ? "bg-[rgba(49,65,88,0.5)] border border-[#314158]"
                : "bg-slate-100 border border-slate-200",
          )}
        >
          <div className="flex justify-between items-center">
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wider",
                theme === "dark" ? "text-[#90A1B9]" : "text-slate-500",
              )}
            >
              Remaining Quota
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className={cn("text-base font-bold", quotaColors.text)}>
                {plan.remaining}
              </span>
              <span
                className={cn(
                  "text-xs",
                  theme === "dark" ? "text-[#62748E]" : "text-slate-400",
                )}
              >
                /{plan.total}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className={cn(
              "h-2 rounded-full overflow-hidden",
              theme === "dark" ? "bg-[#45556C]" : "bg-slate-300",
            )}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn("h-full rounded-full", quotaColors.bar)}
            />
          </div>

          <span className={cn("text-xs", quotaColors.statusColor)}>
            {quotaColors.status}
          </span>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => onGenerate(plan)}
          disabled={plan.remaining === 0}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200",
            plan.isPopular
              ? "bg-[#00BBA7] text-white shadow-[0_2px_4px_-2px_rgba(0,187,167,0.3),0_4px_6px_-1px_rgba(0,187,167,0.3)] hover:bg-[#00A896] active:scale-[0.98]"
              : theme === "dark"
                ? "bg-[#314158] text-white hover:bg-[#3d526e] active:scale-[0.98]"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300 active:scale-[0.98]",
            plan.remaining === 0 && "opacity-60 cursor-not-allowed",
          )}
        >
          Generate Voucher
        </button>
      </div>
    </motion.div>
  );
}

export function VendorServices() {
  const { theme, mounted } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleGenerateClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlan(null), 300);
  };

  const handleConfirmGenerate = () => {
    // Close generate modal and show success modal
    setIsModalOpen(false);
    setTimeout(() => {
      setIsSuccessModalOpen(true);
    }, 300);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSelectedPlan(null);
  };

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen p-4 lg:p-6 bg-slate-100">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mx-auto" />
            <div className="h-4 w-96 bg-slate-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 bg-slate-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "min-h-screen p-4 lg:p-6",
        theme === "dark" ? "bg-[#1E293B]" : "bg-slate-100",
      )}
    >
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            suppressHydrationWarning
            className={cn(
              "text-[32px] font-extrabold leading-8",
              theme === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            Our Services
          </h1>
          <p
            suppressHydrationWarning
            className={cn(
              "text-base font-normal",
              theme === "dark" ? "text-[#90A1B9]" : "text-slate-600",
            )}
          >
            Choose the best data plan that suits your needs. Click to generate
            vouchers.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PlanCard
                plan={plan}
                theme={theme}
                onGenerate={handleGenerateClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <GenerateModal
            plan={selectedPlan}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmGenerate}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={handleCloseSuccessModal}
            plan={selectedPlan}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
