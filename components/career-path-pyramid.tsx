"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import clsx from "clsx";
import { CAREER_STAGES, type CareerStage } from "@/lib/career-path";

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
        <div className="px-4 md:px-8 py-8 flex flex-col items-center justify-center min-h-[480px] border-b lg:border-b-0 lg:border-r border-white/10 bg-[#081528]">
          <Pyramid3D selected={selected} onSelect={setSelected} />
        </div>
        <div className="px-6 py-8 flex items-center bg-[#0B1B35]">
          <StageDetail stage={stage} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pyramid                                                             */
/* ------------------------------------------------------------------ */
/*
 * Uses the same pyramid artwork as ngt.academy (public/pyramid.svg, exported
 * from Figma). The SVG ships two versions of every row:
 *
 *   #pyramid-row-N        the row in its base (unlit) state
 *   #pyramid-row-hover-N  the same row fully lit, stacked on top
 *
 * Exactly like the marketing site, we never redraw anything: we just set the
 * opacity of the hover layers for rows 1…N so the pyramid lights up
 * cumulatively from the base up to the active stage.
 *
 * The file is ~560 KB (it embeds the badge PNGs), so it is fetched at runtime
 * rather than bundled, and the container reserves the SVG's aspect ratio so
 * the layout doesn't jump while it loads.
 */

const SVG_ASPECT = "799 / 701";
const ROW_ID = /^pyramid-row-(\d+)$/;

function Pyramid3D({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (id: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const active = hover ?? selected;

  // Load and prepare the artwork once.
  useEffect(() => {
    let cancelled = false;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

    fetch(`${base}/pyramid.svg`)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((markup) => {
        const host = hostRef.current;
        if (cancelled || !host) return;

        host.innerHTML = markup;

        const svg = host.querySelector("svg");
        if (svg) {
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.style.width = "100%";
          svg.style.height = "auto";
          svg.style.display = "block";
          svg.setAttribute("role", "group");
          svg.setAttribute("aria-label", "Career path pyramid");
        }

        const reduceMotion =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        // Lit overlays: purely visual, never intercept the pointer.
        host.querySelectorAll<SVGGElement>('[id^="pyramid-row-hover-"]').forEach((layer) => {
          layer.style.pointerEvents = "none";
          layer.style.opacity = "0";
          if (!reduceMotion) layer.style.transition = "opacity 220ms ease";
        });

        // Base rows: the interactive targets.
        host.querySelectorAll<SVGGElement>('[id^="pyramid-row-"]').forEach((row) => {
          const match = ROW_ID.exec(row.id);
          if (!match) return;
          const stageInfo = CAREER_STAGES.find((s) => s.id === Number(match[1]));
          row.style.cursor = "pointer";
          row.style.outline = "none";
          row.setAttribute("role", "button");
          row.setAttribute("tabindex", "0");
          if (stageInfo) row.setAttribute("aria-label", `${stageInfo.label}: ${stageInfo.title}`);
        });

        setReady(true);
      })
      .catch(() => {
        /* Leave the reserved space empty; the stepper above still works. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Light rows 1…active by toggling the hover overlays.
  useEffect(() => {
    const host = hostRef.current;
    if (!ready || !host) return;
    for (const s of CAREER_STAGES) {
      const layer = host.querySelector<SVGGElement>(`#pyramid-row-hover-${s.id}`);
      if (layer) layer.style.opacity = s.id <= active ? "1" : "0";
    }
  }, [active, ready]);

  // Resolve which row an event landed on (overlays are pointer-events: none,
  // so the target is always a base row or nothing).
  const rowFromEvent = (e: SyntheticEvent) => {
    const el = (e.target as Element | null)?.closest('[id^="pyramid-row-"]');
    const match = el ? ROW_ID.exec(el.id) : null;
    return match ? Number(match[1]) : null;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[420px]">
      <div
        ref={hostRef}
        className="w-full"
        style={{ aspectRatio: SVG_ASPECT }}
        onClick={(e) => {
          const n = rowFromEvent(e);
          if (n) onSelect(n);
        }}
        onMouseOver={(e) => {
          const n = rowFromEvent(e);
          if (n) setHover(n);
        }}
        onMouseLeave={() => setHover(null)}
        onFocus={(e) => {
          const n = rowFromEvent(e);
          if (n) setHover(n);
        }}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          const n = rowFromEvent(e);
          if (n) {
            e.preventDefault();
            onSelect(n);
          }
        }}
      />

      {/* Fraction pager, as on the marketing site */}
      <div className="mt-4 text-[12px] tabular-nums tracking-widest text-white/60 font-semibold">
        <span className="text-ngt-yellow">{String(active).padStart(2, "0")}</span>
        <span className="mx-1.5 text-white/30">of</span>
        <span>{String(CAREER_STAGES.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage detail                                                        */
/* ------------------------------------------------------------------ */

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
