"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import clsx from "clsx";
import type { EnrollmentStatus, OrderDetails } from "@/lib/types";
import { OrderDetailModal } from "./order-detail-modal";

interface Props {
  productName: string;
  status: EnrollmentStatus;
  order?: OrderDetails;
  size?: "sm" | "md";
  variant?: "yellow" | "outline";
}

export function ViewOrderButton({
  productName,
  status,
  order,
  size = "md",
  variant = "outline",
}: Props) {
  const [open, setOpen] = useState(false);
  if (!order) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={clsx(
          "inline-flex items-center gap-1.5 font-bold tracking-widest uppercase rounded-md transition",
          size === "sm" ? "text-[10px] px-2.5 h-7" : "text-[11px] px-3 h-9",
          variant === "yellow"
            ? "bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
            : "border border-ngt-yellow text-ngt-yellowDark hover:bg-ngt-yellow/10"
        )}
      >
        <Receipt size={size === "sm" ? 11 : 13} />
        View Order Detail
      </button>
      {open && (
        <OrderDetailModal
          productName={productName}
          status={status}
          order={order}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
