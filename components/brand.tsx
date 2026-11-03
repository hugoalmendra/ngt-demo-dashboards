"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { applyBrand, setPreviewBrand, type Brand } from "@/lib/brand";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Keeps data-brand right on client-side navigation (e.g. student view → SSM view). */
export function BrandSync() {
  const pathname = usePathname();
  useEffect(() => {
    applyBrand();
  }, [pathname]);
  return null;
}

/** Small, subtle NGT credit shown under the IAU logo. */
export function PoweredByNgt({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-1 text-[9px] uppercase tracking-widest text-white/45", className)}>
      Powered by
      <img src={`${base}/ngt-icon.png`} alt="" className="w-3 h-3 object-contain opacity-80" />
      <span className="font-semibold">NGT.Academy</span>
    </div>
  );
}

/** Sidebar logo for the student view. Both versions render; CSS shows the right one. */
export function StudentBrandLogo() {
  return (
    <>
      <div className="brand-ngt-only flex items-center gap-2">
        <img src={`${base}/ngt-icon.png`} alt="NGT.Academy" className="w-9 h-9 object-contain" />
        <div className="leading-tight">
          <div className="font-bold text-sm tracking-wide">NGT.ACADEMY</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">Student</div>
        </div>
      </div>
      <div className="brand-iau-only">
        <img src={`${base}/brand/iau-logo-white.png`} alt="International American University" className="w-full h-auto" />
        <PoweredByNgt className="mt-2.5" />
      </div>
    </>
  );
}

/** Mobile header logo. */
export function StudentBrandMark() {
  return (
    <>
      <img src={`${base}/ngt-icon.png`} alt="NGT.Academy" className="brand-ngt-only w-10 h-10 object-contain" />
      <img src={`${base}/brand/iau-mark-white.png`} alt="IAU" className="brand-iau-only h-7 w-auto" />
    </>
  );
}

/** Prototype only: preview the student view as an NGT or an IAU student. */
export function BrandPreviewSwitch() {
  const [brand, setBrand] = useState<Brand>("ngt");
  const pathname = usePathname();

  useEffect(() => {
    setBrand(document.documentElement.getAttribute("data-brand") === "iau" ? "iau" : "ngt");
  }, [pathname]);

  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-white/40 mb-1 text-center">Prototype: view as</div>
      <div role="radiogroup" aria-label="Preview student type" className="grid grid-cols-2 gap-0.5 rounded border border-white/10 p-0.5">
        {(["ngt", "iau"] as Brand[]).map((b) => (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={brand === b}
            onClick={() => {
              setPreviewBrand(b);
              setBrand(b);
            }}
            className={clsx(
              "h-7 rounded-sm text-[10px] font-bold uppercase tracking-widest transition",
              brand === b ? "bg-white text-ngt-ink" : "text-white/50 hover:text-white"
            )}
          >
            {b === "ngt" ? "NGT" : "IAU"}
          </button>
        ))}
      </div>
    </div>
  );
}
