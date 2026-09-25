"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, GraduationCap, Layers, Play, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { Program } from "@/lib/types";
import { ProgressBar } from "./progress-bar";

function computeCourseProgress(course: Program["courses"][number]) {
  if (!course.modules.length) return 0;
  return Math.round(course.modules.reduce((s, m) => s + m.progressPct, 0) / course.modules.length);
}

function computeProgramProgress(program: Program) {
  if (!program.courses.length) return 0;
  const all = program.courses.flatMap((c) => c.modules);
  if (!all.length) return 0;
  return Math.round(all.reduce((s, m) => s + m.progressPct, 0) / all.length);
}

interface Props {
  program: Program;
  /** When true (student view), language is friendlier */
  friendly?: boolean;
  /**
   * Show a Start / Continue / Review button on each course. Programs aren't
   * sequential, so students can open any course, not just the next one.
   */
  learnable?: boolean;
}

export function ProgramTree({ program, friendly, learnable }: Props) {
  const overall = computeProgramProgress(program);
  const [openCourses, setOpenCourses] = useState<Record<string, boolean>>(
    Object.fromEntries(program.courses.map((c) => [c.id, true]))
  );

  return (
    <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
      {/* PROGRAM ROW */}
      <div className="px-5 py-4 bg-ngt-ink text-white flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-ngt-yellow text-black grid place-items-center">
          <GraduationCap size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-0.5">
            {friendly ? "Your Program" : "Program of Study"}
          </div>
          <div className="font-bold text-base truncate">{program.name}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-white/50">Overall</div>
          <div className="text-2xl font-black text-ngt-yellow tabular-nums">{overall}%</div>
        </div>
      </div>
      <div className="px-5 py-3 bg-ngt-ink/95 border-t border-white/5">
        <ProgressBar value={overall} variant="yellow" size="md" />
      </div>

      {/* COURSE → MODULE TREE */}
      <ul className="divide-y divide-ngt-line">
        {program.courses.map((course) => {
          const pct = computeCourseProgress(course);
          const open = openCourses[course.id];
          return (
            <li key={course.id}>
              <div className="relative group flex items-center hover:bg-ngt-bg/60 transition">
                <button
                  onClick={() =>
                    setOpenCourses((p) => ({
                      ...p,
                      [course.id]: !p[course.id],
                    }))
                  }
                  aria-expanded={open}
                  className="flex-1 min-w-0 px-5 py-3 flex items-center gap-3 text-left"
                >
                  <ChevronRight
                    size={16}
                    className={clsx("text-ngt-muted transition-transform", open && "rotate-90")}
                  />
                  <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 grid place-items-center">
                    <BookOpen size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-ngt-muted mb-0.5">Course</div>
                    <div className="font-semibold text-sm line-clamp-2">{course.name}</div>
                  </div>
                  <div
                    className={clsx(
                      "w-[200px] hidden md:block transition-opacity",
                      // Make room for the hover-revealed course button.
                      learnable && "group-hover:opacity-0 [@media(hover:none)]:opacity-100"
                    )}
                  >
                    <ProgressBar value={pct} variant="auto" size="sm" showLabel />
                  </div>
                  <div className="md:hidden text-sm font-bold tabular-nums text-ngt-text w-12 text-right">
                    {pct}%
                  </div>
                </button>
                {learnable && <CourseAction pct={pct} courseName={course.name} />}
              </div>

              {open && (
                <ul className="bg-ngt-bg/40 border-t border-ngt-line/70">
                  {course.modules.map((m) => (
                    <li
                      key={m.id}
                      className="pl-[68px] pr-5 py-2.5 flex items-center gap-3 border-b border-ngt-line/60 last:border-b-0"
                    >
                      <div className="w-6 h-6 rounded bg-violet-50 text-violet-600 grid place-items-center">
                        <Layers size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] uppercase tracking-widest text-ngt-muted">Module</div>
                        <div className="text-[13px] truncate">{m.name}</div>
                      </div>
                      <div className="w-[180px] hidden md:block">
                        <ProgressBar value={m.progressPct} size="sm" variant="auto" showLabel />
                      </div>
                      <div className="md:hidden text-xs font-semibold tabular-nums w-10 text-right text-ngt-muted">
                        {m.progressPct}%
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CourseAction({ pct, courseName }: { pct: number; courseName: string }) {
  const done = pct >= 100;
  const label = pct === 0 ? "Start learning" : done ? "Review" : "Continue";
  return (
    <Link
      href="/learn"
      aria-label={`${label}: ${courseName}`}
      className={clsx(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest transition whitespace-nowrap shadow-card",
        // Overlaid on the progress bar and revealed on row hover / keyboard focus,
        // so it takes no space and the progress bars stay aligned.
        "absolute right-5 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none",
        "group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto",
        // Touch screens have no hover: keep it visible, in the row.
        "[@media(hover:none)]:static [@media(hover:none)]:translate-y-0 [@media(hover:none)]:mr-5 [@media(hover:none)]:shrink-0",
        "[@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
        done
          ? "bg-white border border-ngt-line text-ngt-muted hover:border-ngt-yellow hover:text-ngt-text"
          : "bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
      )}
    >
      {done ? <RotateCcw size={12} /> : <Play size={12} fill="currentColor" />}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
