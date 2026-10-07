"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Check, ChevronDown, Mail, UserRound } from "lucide-react";
import { SSMS, findSsm } from "@/lib/mock-data";
import type { Ssm } from "@/lib/types";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

export function SsmAvatar({ ssm, size = "md" }: { ssm: Ssm; size?: "sm" | "md" }) {
  return (
    <div
      className={clsx(
        "rounded-full grid place-items-center text-white font-bold shrink-0",
        size === "sm" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-[12px]",
        ssm.avatarColor
      )}
    >
      {initials(ssm.name)}
    </div>
  );
}

/** Assigned SSM block for the SSM-facing student profile, with reassignment. */
export function AssignedSsmSection({ initialSsmId }: { initialSsmId?: string }) {
  const [ssmId, setSsmId] = useState(initialSsmId ?? "");
  // Picking a name applies immediately (no Save); keep the previous value
  // around briefly so a mis-click can be undone.
  const [undo, setUndo] = useState<{ previous: string } | null>(null);
  const ssm = findSsm(ssmId);

  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 6000);
    return () => clearTimeout(t);
  }, [undo]);

  const change = (next: string) => {
    setUndo({ previous: ssmId });
    setSsmId(next);
  };

  return (
    <div className="px-5 py-4 border-t border-ngt-line">
      <div className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold mb-2">
        Assigned SSM
      </div>
      {ssm ? (
        <div className="flex items-center gap-3">
          <SsmAvatar ssm={ssm} />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{ssm.name}</div>
            <a
              href={`mailto:${ssm.email}`}
              className="text-[12px] text-ngt-muted hover:text-ngt-yellowDark truncate block"
            >
              {ssm.email}
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
          <UserRound size={16} /> Unassigned
        </div>
      )}
      <label className="mt-3 flex items-center gap-2 text-[11px] text-ngt-muted">
        {ssm ? "Reassign" : "Assign"}
        <span className="relative flex-1 min-w-0">
          <select
            value={ssmId}
            onChange={(e) => change(e.target.value)}
            className="w-full h-8 pl-2.5 pr-8 appearance-none rounded-md border border-ngt-line bg-white text-[13px] text-ngt-text truncate focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
          >
            <option value="">Unassigned</option>
            {SSMS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ngt-muted"
          />
        </span>
      </label>
      {undo && (
        <div role="status" className="mt-2 flex items-center justify-between gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <Check size={13} strokeWidth={3} />
            {ssm ? `Reassigned to ${ssm.name}` : "SSM removed"}
          </span>
          <button
            type="button"
            onClick={() => {
              setSsmId(undo.previous);
              setUndo(null);
            }}
            className="font-semibold text-ngt-yellowDark hover:underline"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

/** "Your Student Success Manager" card for the student-facing profile. */
export function StudentSsmCard({ ssmId }: { ssmId?: string }) {
  const ssm = findSsm(ssmId);
  return (
    <div className="bg-white border border-ngt-line rounded-lg p-5 shadow-card max-w-2xl">
      <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-3">
        Your Student Success Manager
      </div>
      {ssm ? (
        <div className="flex items-center gap-4">
          <SsmAvatar ssm={ssm} />
          <div className="flex-1 min-w-0">
            <div className="font-bold">{ssm.name}</div>
            <div className="text-[13px] text-ngt-muted truncate">{ssm.email}</div>
          </div>
          <a
            href={`mailto:${ssm.email}`}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold uppercase tracking-widest"
          >
            <Mail size={13} /> Email
          </a>
        </div>
      ) : (
        <p className="text-[13px] text-ngt-muted">
          You&apos;ll be assigned a Student Success Manager soon. In the meantime, reach out to
          Academic Support.
        </p>
      )}
    </div>
  );
}
