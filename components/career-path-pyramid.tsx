"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { CAREER_STAGES, type CareerStage } from "@/lib/career-path";

interface Props {
  /** Which stage to highlight on load (1–7). */
  initialStage?: number;
  /** Optional “you are here” stage for the student. */
  currentStage?: number;
}

export function CareerPathPyramid({ initialStage = 1, currentStage }: Props) {
  const [selected, setSelected] = useState(initialStage);
  const stage = CAREER_STAGES.find((s) => s.id === selected) ?? CAREER_STAGES[0];

  return (
    <div className="rounded-xl overflow-hidden border border-[#1a3a6b] bg-[#0B1B35] text-white shadow-card">
      {/* Header */}
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

      {/* Stage timeline */}
      <div className="px-4 md:px-6 py-4 border-b border-white/10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max mx-auto">
          {CAREER_STAGES.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setSelected(s.id)}
                className={clsx(
                  "relative w-9 h-9 rounded-full text-[11px] font-bold tabular-nums transition shrink-0",
                  selected === s.id
                    ? "bg-ngt-yellow text-black ring-2 ring-ngt-yellow ring-offset-2 ring-offset-[#0B1B35]"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white",
                  currentStage === s.id &&
                    selected !== s.id &&
                    "ring-1 ring-emerald-400/60"
                )}
                title={s.title}
              >
                {String(s.id).padStart(2, "0")}
              </button>
              {i < CAREER_STAGES.length - 1 && (
                <div className="w-4 md:w-8 h-px bg-white/20 shrink-0" />
              )}
            </div>
          ))}
        </div>
        {currentStage && (
          <p className="text-[11px] text-emerald-400/90 mt-3 text-center">
            You are currently on Stage {String(currentStage).padStart(2, "0")}
          </p>
        )}
      </div>

      {/* Pyramid + detail */}
      <div className="grid lg:grid-cols-2 gap-0">
        <div className="px-6 py-8 flex items-end justify-center min-h-[420px] border-b lg:border-b-0 lg:border-r border-white/10 bg-[#081528]">
          <Pyramid selected={selected} currentStage={currentStage} onSelect={setSelected} />
        </div>
        <div className="px-6 py-8 flex items-center">
          <StageDetail stage={stage} />
        </div>
      </div>
    </div>
  );
}

function Pyramid({
  selected,
  currentStage,
  onSelect,
}: {
  selected: number;
  currentStage?: number;
  onSelect: (id: number) => void;
}) {
  // Render top (stage 7) first, base (stage 1) last.
  const layers = [...CAREER_STAGES].reverse();

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-[3px]">
      {layers.map((stage) => {
        const layerIndex = 7 - stage.id;
        const widthPct = 38 + layerIndex * 9;
        const isSelected = selected === stage.id;
        const isCurrent = currentStage === stage.id;

        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            style={{ width: `${widthPct}%` }}
            className={clsx(
              "relative py-2.5 px-2 text-center transition-all duration-200",
              "border border-transparent hover:border-ngt-yellow/40",
              isSelected
                ? "bg-ngt-yellow/20 border-ngt-yellow text-white shadow-[0_0_24px_rgba(255,193,7,0.25)]"
                : "bg-[#1a3a6b]/80 text-white/80 hover:bg-[#1a3a6b]",
              isCurrent && !isSelected && "ring-1 ring-emerald-400/50"
            )}
          >
            <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-tight">
              {stage.pyramidLabel}
            </div>
            {stage.pyramidDetail && (
              <div className="text-[8px] md:text-[9px] text-white/60 mt-0.5 leading-tight">
                {stage.pyramidDetail}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StageDetail({ stage }: { stage: CareerStage }) {
  return (
    <div className="w-full border border-ngt-yellow/30 rounded-lg bg-[#0f2447]/60 p-5 md:p-6">
      <div className="text-[11px] uppercase tracking-widest text-ngt-yellow font-bold">
        {stage.label}: {stage.title}
      </div>
      <p className="text-[14px] text-white/80 mt-3 leading-relaxed">{stage.description}</p>

      <div className="grid grid-cols-2 gap-4 mt-5">
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
          <ul className="space-y-1">
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

      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold uppercase tracking-widest transition"
      >
        Get started <ArrowUpRight size={14} />
      </button>
    </div>
  );
}
