"use client";

import { useState } from "react";
import {
  ChevronDown,
  Code2,
  ExternalLink,
  FileText,
  Flag,
  GraduationCap,
  MessageSquare,
  Upload,
} from "lucide-react";
import clsx from "clsx";
import type { Milestone, MilestoneStatus, MilestoneType } from "@/lib/types";
import { MilestoneStatusBadge, MilestoneStatusLegend } from "./milestone-status-badge";
import { formatDate } from "@/lib/format";

const TYPE_META: Record<MilestoneType, { icon: React.ReactNode; tint: string }> = {
  Technical: { icon: <Code2 size={14} />, tint: "bg-violet-50 text-violet-600" },
  Exam: { icon: <GraduationCap size={14} />, tint: "bg-sky-50 text-sky-600" },
  Project: { icon: <FileText size={14} />, tint: "bg-amber-50 text-amber-700" },
};

interface Props {
  milestones: Milestone[];
  variant: "student" | "ssm";
  title?: string;
}

export function MilestoneList({ milestones, variant, title }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const order: Record<MilestoneStatus, number> = {
    Overdue: 0,
    "Ready for Review": 1,
    "Sent Back": 2,
    Incomplete: 3,
    Complete: 4,
  };
  const sorted = [...milestones].sort(
    (a, b) =>
      order[a.status] - order[b.status] ||
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
      <header className="px-5 py-3 border-b border-ngt-line flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 grid place-items-center">
            <Flag size={14} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Milestones
            </div>
            <div className="font-bold text-sm">{title ?? "Submissions & reviews"}</div>
          </div>
        </div>
        <MilestoneStatusLegend />
      </header>

      <ul className="divide-y divide-ngt-line">
        {sorted.map((m) => {
          const open = openId === m.id;
          const overdue = m.status === "Overdue";
          return (
            <li key={m.id}>
              <button
                onClick={() => setOpenId(open ? null : m.id)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-ngt-bg/50 text-left"
              >
                <div
                  className={clsx(
                    "w-8 h-8 rounded grid place-items-center shrink-0",
                    TYPE_META[m.type].tint
                  )}
                >
                  {TYPE_META[m.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{m.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-ngt-muted mt-0.5">
                    <span className="uppercase tracking-wider">{m.type} milestone</span>
                    <span>·</span>
                    <span className={clsx(overdue && "text-rose-600 font-semibold")}>
                      Due {formatDate(m.dueDate)}
                    </span>
                  </div>
                </div>
                <MilestoneStatusBadge status={m.status} />
                <ChevronDown
                  size={16}
                  className={clsx("text-ngt-muted transition-transform", open && "rotate-180")}
                />
              </button>

              {open && (
                <div className="px-5 pb-5 pt-1 bg-ngt-bg/40 border-t border-ngt-line/70">
                  <p className="text-[13px] text-ngt-text leading-relaxed mb-3 max-w-3xl">
                    {m.description}
                  </p>

                  {m.link && (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-ngt-yellowDark hover:underline text-[13px] font-semibold mb-4"
                    >
                      {m.link} <ExternalLink size={12} />
                    </a>
                  )}

                  {m.feedback && (
                    <div className="mb-4 rounded-md bg-white border border-ngt-line p-3 max-w-3xl">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
                        <MessageSquare size={12} /> Coach feedback
                      </div>
                      <p className="text-[13px] text-ngt-text leading-relaxed">{m.feedback}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-3 gap-2 text-[12px] text-ngt-muted mb-4 max-w-3xl">
                    <Meta label="Due" value={formatDate(m.dueDate)} />
                    <Meta label="Submitted" value={m.submittedAt ? formatDate(m.submittedAt) : "—"} />
                    <Meta label="Completed" value={m.completedAt ? formatDate(m.completedAt) : "—"} />
                  </div>

                  {variant === "student" ? (
                    <StudentActions status={m.status} />
                  ) : (
                    <SsmActions status={m.status} />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-ngt-line rounded px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold">
        {label}
      </div>
      <div className="text-[13px] text-ngt-text font-medium">{value}</div>
    </div>
  );
}

function StudentActions({ status }: { status: MilestoneStatus }) {
  if (status === "Complete") {
    return (
      <div className="text-[12px] text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 inline-flex items-center gap-2 px-3 py-1.5 rounded-md">
        ✓ Milestone complete — no action required
      </div>
    );
  }
  const label =
    status === "Sent Back"
      ? "RE-SUBMIT FILE"
      : status === "Ready for Review"
      ? "REPLACE SUBMISSION"
      : "SUBMIT FILE";
  return (
    <div className="bg-white border border-dashed border-ngt-line rounded-md p-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-ngt-bg grid place-items-center text-ngt-muted">
          <Upload size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Upload submission</div>
          <div className="text-[11px] text-ngt-muted">
            Accepted: pdf, png, jpg, mp4, zip, docx, pka, pkt…
          </div>
        </div>
        <button className="bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold tracking-widest px-4 h-9 rounded-md">
          {label}
        </button>
      </div>
    </div>
  );
}

function SsmActions({ status }: { status: MilestoneStatus }) {
  return (
    <div className="bg-ngt-ink text-white rounded-md p-4 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-[11px] uppercase tracking-widest text-white/60 font-semibold flex flex-col gap-1">
          Set status
          <select
            defaultValue={status}
            className="h-9 px-2 rounded bg-white text-ngt-text border border-white/10 text-sm"
          >
            <option>Complete</option>
            <option>Sent Back</option>
            <option>Ready for Review</option>
            <option>Overdue</option>
            <option>Incomplete</option>
          </select>
        </label>
        <label className="text-[11px] uppercase tracking-widest text-white/60 font-semibold flex flex-col gap-1">
          Feedback
          <textarea
            placeholder="Leave feedback for the student…"
            className="min-h-[36px] px-2 py-1.5 rounded bg-white text-ngt-text border border-white/10 text-sm resize-y"
          />
        </label>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button className="bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold tracking-widest px-4 h-9 rounded-md">
          CANCEL
        </button>
        <button className="bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold tracking-widest px-4 h-9 rounded-md">
          SAVE
        </button>
      </div>
    </div>
  );
}
