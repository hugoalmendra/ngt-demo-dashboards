"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import type { EnrollmentStatus, OrderDetails } from "@/lib/types";
import { formatDate } from "@/lib/format";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const STATUS_TEXT: Record<EnrollmentStatus, string> = {
  Active: "text-emerald-600",
  Completed: "text-ngt-yellowDark",
  Expired: "text-rose-600",
  Paused: "text-amber-600",
};

interface Props {
  productName: string;
  status: EnrollmentStatus;
  order: OrderDetails;
  onClose: () => void;
}

export function OrderDetailModal({ productName, status, order, onClose }: Props) {
  // Close on Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-7 py-5 flex items-start justify-between border-b border-ngt-line">
          <div>
            <h2 className="text-xl font-bold text-ngt-text leading-tight">{productName}</h2>
            <div className="text-[12px] mt-1">
              Product status:{" "}
              <span className={clsx("font-bold", STATUS_TEXT[status])}>
                {status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ngt-muted hover:text-ngt-text"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="px-7 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
            <Field label="Payment Plan" value={order.paymentPlan} />
            <Field label="Start Date" value={formatDate(order.startDate)} />
            <Field
              label="Next Billing Date"
              value={order.nextBillingDate ? formatDate(order.nextBillingDate) : "N/A"}
            />
            <Field
              label="Payment Method"
              value={
                <>
                  {order.paymentMethod}
                  <div className="text-ngt-yellowDark text-[11px] font-bold tracking-widest mt-0.5 cursor-pointer hover:text-ngt-yellow">
                    UPDATE
                  </div>
                </>
              }
            />
          </div>

          <h3 className="text-lg font-bold mb-3">Order Summary</h3>
          <div className="border border-ngt-line rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ngt-bg/60 text-[10px] uppercase tracking-widest text-ngt-muted">
                  <th className="text-left px-4 py-2.5 font-semibold">Payment</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Charge Date</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Payment Method</th>
                  <th className="text-right px-4 py-2.5 font-semibold pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ngt-line">
                {order.charges.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-ngt-muted text-[12px]">
                      No charges on record.
                    </td>
                  </tr>
                )}
                {order.charges.map((c, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-semibold">{fmt(c.amount)}</td>
                    <td className="px-4 py-3">{formatDate(c.date)}</td>
                    <td className="px-4 py-3">{c.method}</td>
                    <td className="px-4 py-3 text-right pr-5">
                      {c.refunded ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 ring-1 ring-rose-200 px-2 py-0.5 rounded">
                          Refunded
                        </span>
                      ) : (
                        <button className="bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold tracking-widest px-3 h-8 rounded-md">
                          REFUND
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 border-t border-ngt-line pt-4 flex flex-wrap items-center gap-3">
            <div className="text-sm text-ngt-text flex-1 min-w-[180px]">
              {status === "Paused" ? (
                <>If you Resume, the user will regain access and billing will resume.</>
              ) : status === "Active" ? (
                <>If you Pause, the user won't be charged and won't have access to this product.</>
              ) : (
                <>This product is {status.toLowerCase()}. No active billing.</>
              )}
            </div>
            {status === "Active" && (
              <button className="border border-sky-500 text-sky-600 hover:bg-sky-50 text-[11px] font-bold tracking-widest px-4 h-9 rounded-md">
                PAUSE
              </button>
            )}
            {status === "Paused" && (
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold tracking-widest px-4 h-9 rounded-md">
                RESUME
              </button>
            )}
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div className="bg-ngt-bg/70 rounded px-3 py-2.5 flex items-center justify-between">
              <span className="text-sm text-ngt-text">
                Amount Paid: <span className="font-bold">{fmt(order.amountPaid)}</span>
              </span>
              <button className="border border-ngt-yellow text-ngt-yellowDark hover:bg-ngt-yellow/10 text-[10px] font-bold tracking-widest px-3 h-8 rounded">
                REFUND ENTIRE PRODUCT
              </button>
            </div>
            <div className="bg-ngt-bg/70 rounded px-3 py-2.5 flex items-center justify-between">
              <span className="text-sm text-ngt-text">
                Balance Due: <span className="font-bold">{fmt(order.balanceDue)}</span>
              </span>
              <button
                disabled={order.balanceDue === 0}
                className={clsx(
                  "text-[10px] font-bold tracking-widest px-3 h-8 rounded",
                  order.balanceDue === 0
                    ? "bg-ngt-line text-ngt-muted cursor-not-allowed"
                    : "bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
                )}
              >
                PAY OFF REMAINING BALANCE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-ngt-text leading-tight">{value}</div>
    </div>
  );
}
