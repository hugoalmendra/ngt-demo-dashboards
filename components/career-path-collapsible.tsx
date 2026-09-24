"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown, TrendingUp } from "lucide-react";
import { CareerPathPyramid } from "@/components/career-path-pyramid";

export function CareerPathCollapsible({ currentStage }: { currentStage: number }) {
  const [open, setOpen] = useState(false);
  // Mount the pyramid on first open only, then keep it so the SVG isn't refetched.
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // React 18 has no typed `inert` prop; keep the collapsed pyramid out of tab order.
  useEffect(() => {
    panelRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  const toggle = () => {
    setOpen((o) => !o);
    setMounted(true);
  };

  return (
    <section className="bg-[#0B1B35] border border-[#1a3a6b] rounded-lg shadow-card overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-ngt-yellow/15 text-ngt-yellow grid place-items-center shrink-0">
            <TrendingUp size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-white/50 font-semibold">
              Career Success
            </div>
            <div className="font-bold text-white text-sm mt-0.5">
              {open ? "Your career pyramid" : "View your full career pyramid"}
            </div>
            <p className="text-[12px] text-white/60 mt-1 truncate">
              You&apos;re on Stage {String(currentStage).padStart(2, "0")} — see what&apos;s next
            </p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ngt-yellow group-hover:text-white transition">
          {open ? "Collapse" : "Expand"}
          <ChevronDown
            size={14}
            className={clsx("transition-transform duration-200", open && "rotate-180")}
          />
        </span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          {mounted && (
            <div className="px-3 pb-3 md:px-4 md:pb-4">
              <CareerPathPyramid initialStage={currentStage} currentStage={currentStage} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
