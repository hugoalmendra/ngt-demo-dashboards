"use client";

import { useState } from "react";
import { ChevronRight, BookOpen, GraduationCap, Layers } from "lucide-react";
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
}

export function ProgramTree({ program, friendly }: Props) {
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
              <button
                onClick={() => setOpenCourses((p) => ({ ...p, [course.id]: !p[course.id] }))}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-ngt-bg/60 transition text-left"
              >
                <ChevronRight
                  size={16}
                  className={clsx("text-ngt-muted transition-transform", open && "rotate-90")}
                />
                <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 grid place-items-center">
                  <BookOpen size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-ngt-muted mb-0.5">
                    Course
                  </div>
                  <div className="font-semibold text-sm truncate">{course.name}</div>
                </div>
                <div className="w-[200px] hidden md:block">
                  <ProgressBar value={pct} variant="auto" size="sm" showLabel />
                </div>
                <div className="md:hidden text-sm font-bold tabular-nums text-ngt-text w-12 text-right">
                  {pct}%
                </div>
              </button>

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
                        <div className="text-[9px] uppercase tracking-widest text-ngt-muted">
                          Module
                        </div>
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
