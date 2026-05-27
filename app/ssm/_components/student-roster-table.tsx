"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import clsx from "clsx";
import type { Student } from "@/lib/types";
import { ProgressBar } from "@/components/progress-bar";
import { StatusPill } from "@/components/status-pill";
import { MilestoneStatusCounts } from "@/components/milestone-status-badge";
import { formatShortDate } from "@/lib/format";

interface Props {
  students: Student[];
}

export function StudentRosterTable({ students }: Props) {
  const [q, setQ] = useState("");
  const [cohort, setCohort] = useState<string>("All");

  const cohorts = useMemo(
    () => ["All", ...Array.from(new Set(students.map((s) => s.cohort))).sort()],
    [students]
  );

  const rows = useMemo(() => {
    return students.filter((s) => {
      const matchesQ =
        q.trim() === "" ||
        s.fullName.toLowerCase().includes(q.toLowerCase()) ||
        s.email.toLowerCase().includes(q.toLowerCase()) ||
        s.programOfStudy.toLowerCase().includes(q.toLowerCase());
      const matchesCohort = cohort === "All" || s.cohort === cohort;
      return matchesQ && matchesCohort;
    });
  }, [students, q, cohort]);

  return (
    <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
      {/* TOOLBAR */}
      <div className="px-4 py-3 border-b border-ngt-line flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ngt-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, program..."
            className="h-9 pl-9 pr-3 rounded-md border border-ngt-line text-sm w-[300px] focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Filter size={14} className="text-ngt-muted" />
          <label className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
            Cohort
          </label>
          <select
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="h-9 px-2 rounded-md border border-ngt-line text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
          >
            {cohorts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-[12px] text-ngt-muted">
          {rows.length} of {students.length} students
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ngt-bg/60 text-[10px] uppercase tracking-widest text-ngt-muted">
              <Th>Student</Th>
              <Th>Program of Study</Th>
              <Th>Cohort / IAU Term</Th>
              <Th>Status</Th>
              <Th>Program %</Th>
              <Th>100-Day Goal</Th>
              <Th>FSNA Delta</Th>
              <Th>Last Active</Th>
              <Th>Milestones</Th>
              <Th>Certs</Th>
              <Th>VA Chapter</Th>
              <Th className="text-right pr-5">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ngt-line">
            {rows.map((s) => {
              const earnedCerts = s.certs.filter((c) => c.earned);
              return (
                <tr key={s.id} className="hover:bg-ngt-bg/40">
                  <Td>
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div
                        className={clsx(
                          "w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-bold shrink-0",
                          s.avatarColor
                        )}
                      >
                        {s.fullName
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/ssm/students/${s.id}`}
                          className="font-semibold text-ngt-text hover:text-ngt-yellowDark truncate block"
                        >
                          {s.fullName}
                        </Link>
                        <div className="text-[11px] text-ngt-muted truncate">{s.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="text-[13px] font-medium flex items-center gap-2">
                      <span className="truncate">{s.programOfStudy}</span>
                      {s.additionalEnrollments && s.additionalEnrollments.length > 0 && (
                        <span
                          title={s.additionalEnrollments
                            .map((e) => `${e.name} (${e.status})`)
                            .join("\n")}
                          className="shrink-0 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                        >
                          +{s.additionalEnrollments.length}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-ngt-muted">{s.ngtSpecialization}</div>
                  </Td>
                  <Td>
                    <div className="text-[13px]">{s.cohort}</div>
                    <div className="text-[11px] text-ngt-muted">{s.iauSchoolTerm}</div>
                  </Td>
                  <Td>
                    <StatusPill status={s.progressStatus} />
                  </Td>
                  <Td>
                    <div className="w-[140px]">
                      <ProgressBar value={s.programProgressPct} variant="auto" size="sm" showLabel />
                    </div>
                  </Td>
                  <Td>
                    <div className="w-[120px]">
                      <ProgressBar value={s.hundredDayGoalPct} variant="yellow" size="sm" showLabel />
                    </div>
                  </Td>
                  <Td>
                    <span
                      className={clsx(
                        "font-bold tabular-nums",
                        s.fsnaDeltaDays > 0 && "text-emerald-600",
                        s.fsnaDeltaDays === 0 && "text-ngt-text",
                        s.fsnaDeltaDays < 0 && "text-rose-600"
                      )}
                    >
                      {s.fsnaDeltaDays > 0 ? "+" : ""}
                      {s.fsnaDeltaDays}d
                    </span>
                  </Td>
                  <Td>
                    <div className="text-[13px]">{formatShortDate(s.lastActiveDate)}</div>
                    <div
                      className={clsx(
                        "text-[11px]",
                        s.daysSinceActive >= 14
                          ? "text-rose-600 font-semibold"
                          : s.daysSinceActive >= 7
                          ? "text-amber-600"
                          : "text-ngt-muted"
                      )}
                    >
                      {s.daysSinceActive}d ago
                    </div>
                  </Td>
                  <Td>
                    <MilestoneStatusCounts milestones={s.milestones} />
                    <div className="text-[10px] text-ngt-muted mt-1">
                      {s.milestones.filter((m) => m.status === "Complete").length}/
                      {s.milestones.length} done
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      {s.certs.map((c) => (
                        <span
                          key={c.code}
                          title={`${c.label}${c.earned ? " (earned)" : ` — ${c.progressPct}%`}`}
                          className={clsx(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded",
                            c.earned
                              ? "bg-emerald-100 text-emerald-700"
                              : c.progressPct > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-ngt-bg text-ngt-muted/70"
                          )}
                        >
                          {shortCode(c.code)}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-ngt-muted mt-1">
                      {earnedCerts.length}/{s.certs.length} earned
                    </div>
                  </Td>
                  <Td>
                    <span className="text-[12px] text-ngt-muted">
                      {s.vaBenefitChapter ?? "—"}
                    </span>
                  </Td>
                  <Td className="text-right pr-5">
                    <Link
                      href={`/ssm/students/${s.id}`}
                      className="text-[11px] font-semibold uppercase tracking-widest text-ngt-yellowDark hover:text-ngt-yellow"
                    >
                      Open →
                    </Link>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={clsx("text-left px-3 py-2.5 font-semibold whitespace-nowrap", className)}>
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown size={10} className="opacity-30" />
      </span>
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("px-3 py-2.5 align-middle", className)}>{children}</td>;
}

function shortCode(code: string) {
  return code === "NetworkPlus" ? "NET+" : code === "SecurityPlus" ? "SEC+" : code;
}
