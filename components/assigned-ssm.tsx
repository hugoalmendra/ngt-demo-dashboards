"use client";

import { useState } from "react";
import clsx from "clsx";
import { Mail, UserRound } from "lucide-react";
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
  const ssm = findSsm(ssmId);

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
        <select
          value={ssmId}
          onChange={(e) => setSsmId(e.target.value)}
          className="flex-1 h-8 px-2 rounded-md border border-ngt-line bg-white text-[13px] text-ngt-text focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
        >
          <option value="">Unassigned</option>
          {SSMS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
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
