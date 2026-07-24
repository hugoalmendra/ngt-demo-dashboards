"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  CAREER_STAGES,
  PYRAMID_LAYER_HEIGHTS,
  PYRAMID_LAYER_WIDTHS,
  type CareerStage,
} from "@/lib/career-path";

interface Props {
  initialStage?: number;
  currentStage?: number;
}

export function CareerPathPyramid({ initialStage = 1, currentStage }: Props) {
  const [selected, setSelected] = useState(initialStage);
  const stage = CAREER_STAGES.find((s) => s.id === selected) ?? CAREER_STAGES[0];

  return (
    <div className="rounded-xl overflow-hidden border border-[#1a3a6b] bg-[#0B1B35] text-white shadow-card">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-[11px] uppercase tracking-widest text-white/50 font-semibold">
          Beyond your first job
        </div>
        <h2 className="text-xl md:text-2xl font-black mt-1 leading-tight">
          Your path from beginner to a high-income IT career
        </h2>
        <p className="text-[13px] text-white/60 mt-2 max-w-2xl">
          NGT isn&apos;t just about helping you land your first job — it&apos;s about building a
          long-term career in tech, step by step.
        </p>
      </div>

      <div className="px-4 md:px-8 py-5 border-b border-white/10 overflow-x-auto">
        <div className="flex items-center justify-center gap-0 min-w-max mx-auto">
          {CAREER_STAGES.map((s, i) => {
            const reached = s.id <= selected;
            const isCurrent = s.id === selected;
            return (
              <div key={s.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setSelected(s.id)}
                  className={clsx(
                    "relative z-10 w-9 h-9 rounded-full text-[11px] font-bold tabular-nums transition shrink-0",
                    reached
                      ? "bg-ngt-yellow text-[#0B1B35]"
                      : "bg-[#0a1628] text-ngt-yellow border border-ngt-yellow/60",
                    isCurrent && "ring-2 ring-white/40 ring-offset-2 ring-offset-[#0B1B35]",
                    currentStage === s.id &&
                      !isCurrent &&
                      "ring-1 ring-emerald-400/50 ring-offset-1 ring-offset-[#0B1B35]"
                  )}
                  title={s.title}
                >
                  {String(s.id).padStart(2, "0")}
                </button>
                {i < CAREER_STAGES.length - 1 && (
                  <div
                    className={clsx(
                      "w-6 md:w-10 h-0.5 shrink-0 -mx-0.5",
                      s.id < selected ? "bg-ngt-yellow" : "bg-ngt-yellow/25"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        {currentStage && (
          <p className="text-[11px] text-emerald-400/90 mt-3 text-center">
            You are currently on Stage {String(currentStage).padStart(2, "0")}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        <div className="px-4 md:px-8 py-10 flex items-end justify-center min-h-[480px] border-b lg:border-b-0 lg:border-r border-white/10 bg-[#081528]">
          <Pyramid3D selected={selected} onSelect={setSelected} />
        </div>
        <div className="px-6 py-8 flex items-center bg-[#0B1B35]">
          <StageDetail stage={stage} />
        </div>
      </div>
    </div>
  );
}

function Pyramid3D({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (id: number) => void;
}) {
  const layers = [...CAREER_STAGES].reverse();

  return (
    <div
      className="flex flex-col items-center w-full max-w-[360px]"
      style={{ perspective: "800px" }}
    >
      {layers.map((stage) => {
        const idx = stage.id - 1;
        const width = PYRAMID_LAYER_WIDTHS[idx];
        const height = PYRAMID_LAYER_HEIGHTS[idx];
        const isSelected = selected === stage.id;

        return (
          <PyramidLayer
            key={stage.id}
            stage={stage}
            width={width}
            height={height}
            isSelected={isSelected}
            onSelect={() => onSelect(stage.id)}
          />
        );
      })}
    </div>
  );
}

function PyramidLayer({
  stage,
  width,
  height,
  isSelected,
  onSelect,
}: {
  stage: CareerStage;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const sideDepth = Math.max(10, Math.round(width * 0.055));

  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative block mx-auto text-left transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ngt-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-[#081528]"
      style={{
        width: width + sideDepth,
        height,
        marginBottom: stage.id === 1 ? 0 : -1,
      }}
      aria-label={`${stage.label}: ${stage.title}`}
    >
      {/* Right 3D face */}
      <div
        className="absolute top-[2px] bottom-0 rounded-r-[2px]"
        style={{
          right: 0,
          width: sideDepth,
          background: isSelected
            ? "linear-gradient(180deg, #c9940a 0%, #7a5606 100%)"
            : "linear-gradient(180deg, #a67c00 0%, #6b4d05 100%)",
          transform: "skewY(-14deg)",
          transformOrigin: "top left",
        }}
        aria-hidden
      />

      {/* Front face */}
      <div
        className={clsx(
          "relative flex items-center justify-center overflow-hidden h-full transition-shadow duration-200",
          isSelected &&
            "shadow-[0_0_28px_rgba(255,193,7,0.55),0_4px_20px_rgba(255,143,0,0.35)] z-10"
        )}
        style={{
          width,
          clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0% 100%)",
          background: isSelected
            ? "linear-gradient(180deg, #ffe082 0%, #ffc107 45%, #ff9800 100%)"
            : "linear-gradient(180deg, #ffd54f 0%, #ffc107 50%, #e6a800 100%)",
          borderTop: isSelected ? "2px solid #fff8e1" : "1px solid rgba(255,255,255,0.25)",
        }}
      >
        <LayerContent stage={stage} compact={width < 180} />
      </div>
    </button>
  );
}

function LayerContent({ stage, compact }: { stage: CareerStage; compact?: boolean }) {
  if (stage.pyramidVisual === "fsna") {
    return <FsnaBadge />;
  }
  if (stage.pyramidVisual === "vendor-badges") {
    return (
      <div className={clsx("flex items-center justify-center gap-1 px-1", compact && "scale-90")}>
        <VendorBadge vendor="CompTIA" name="Network+" accent="red" />
        <VendorBadge vendor="Cisco" name="CCNA" accent="blue" />
        <VendorBadge vendor="CompTIA" name="Security+" accent="red" />
      </div>
    );
  }
  if (stage.pyramidVisual === "ngt-badges") {
    return (
      <div className={clsx("flex items-center justify-center gap-1 px-1", compact && "scale-90")}>
        <NgtCertBadge code="FSNP" />
        <NgtCertBadge code="NCSA" />
        <NgtCertBadge code="AIS" />
      </div>
    );
  }

  return (
    <span
      className={clsx(
        "px-2 text-center font-bold uppercase tracking-wide text-[#3e2723] leading-tight",
        compact ? "text-[7px]" : widthClass(stage.pyramidLabel.length)
      )}
    >
      {stage.pyramidLabel}
    </span>
  );
}

function widthClass(len: number) {
  if (len > 28) return "text-[6px] md:text-[7px]";
  if (len > 18) return "text-[7px] md:text-[8px]";
  return "text-[8px] md:text-[9px]";
}

function FsnaBadge() {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="w-9 h-9 rounded bg-[#3e2723]/90 grid place-items-center shrink-0 border border-[#5d4037]">
        <span className="text-ngt-yellow font-black text-lg leading-none">N</span>
      </div>
      <div className="text-left leading-none">
        <div className="text-[13px] font-black text-[#3e2723] tracking-tight">FSNA</div>
        <div className="text-[8px] font-bold text-[#5d4037] uppercase tracking-widest mt-0.5">
          Certified
        </div>
      </div>
    </div>
  );
}

function VendorBadge({
  vendor,
  name,
  accent,
}: {
  vendor: string;
  name: string;
  accent: "red" | "blue";
}) {
  const accentBg = accent === "red" ? "bg-[#c62828]" : "bg-[#1565c0]";
  return (
    <div className="w-[52px] h-[38px] rounded-sm bg-white border border-black/10 overflow-hidden flex flex-col shadow-sm">
      <div className={clsx("h-3 flex items-center justify-center", accentBg)}>
        <span className="text-[5px] font-bold text-white uppercase tracking-tighter truncate px-0.5">
          {vendor}
        </span>
      </div>
      <div className="flex-1 grid place-items-center px-0.5">
        <span className="text-[6px] font-bold text-[#212121] text-center leading-tight">
          {name}
        </span>
      </div>
    </div>
  );
}

function NgtCertBadge({ code }: { code: string }) {
  return (
    <div className="w-[52px] h-[38px] rounded-sm bg-white border border-black/10 overflow-hidden flex shadow-sm">
      <div className="w-5 bg-[#3e2723] grid place-items-center shrink-0">
        <span className="text-ngt-yellow font-black text-[10px] leading-none">N</span>
      </div>
      <div className="flex-1 flex flex-col justify-center px-0.5 min-w-0">
        <span className="text-[7px] font-black text-[#212121] leading-none">{code}</span>
        <span className="text-[5px] font-bold text-[#616161] uppercase tracking-tighter leading-tight mt-0.5">
          Certified
        </span>
      </div>
    </div>
  );
}

function StageDetail({ stage }: { stage: CareerStage }) {
  return (
    <div className="w-full border border-ngt-yellow/40 rounded-lg bg-[#0a1628] p-5 md:p-6">
      <div className="text-[11px] uppercase tracking-widest font-bold text-ngt-yellow">
        {stage.label}
      </div>
      <h3 className="text-xl md:text-2xl font-black mt-1 leading-tight">{stage.title}</h3>
      <p className="text-[14px] text-white/75 mt-3 leading-relaxed">{stage.description}</p>

      <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            Timeline
          </div>
          <div className="text-sm font-bold mt-1">{stage.timeline}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            {stage.outcomeLabel}
          </div>
          <div className="text-sm font-bold mt-1 text-ngt-yellow">{stage.outcome}</div>
        </div>
      </div>

      {stage.certifications && stage.certifications.length > 0 && (
        <div className="mt-5">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
            Certifications
          </div>
          <ul className="space-y-1.5">
            {stage.certifications.map((c) => (
              <li key={c} className="text-[13px] text-white/80 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-ngt-yellow shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage.roleFocus && stage.roleFocus.length > 0 && (
        <div className="mt-5">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">
            Role focus
          </div>
          <div className="flex flex-wrap gap-2">
            {stage.roleFocus.map((r) => (
              <span
                key={r}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-white/10 text-white/90"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
