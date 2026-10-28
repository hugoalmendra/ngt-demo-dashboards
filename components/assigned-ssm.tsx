"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Check, ChevronDown, Copy, LifeBuoy, Mail, UserRound } from "lucide-react";
import { findSsm } from "@/lib/mock-data";
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

/**
 * Assigned SSM block for the SSM-facing student profile. Read-only: the SSM is
 * the HubSpot Contact owner and is changed in HubSpot, not in the LMS.
 */
export function AssignedSsmSection({ ssmId }: { ssmId?: string }) {
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
      <p className="mt-2 text-[11px] text-ngt-muted">Managed in HubSpot (Contact owner)</p>
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

/**
 * Top bar button for students: "Your SSM" pill that opens a small contact card,
 * so support is one click away from every student page.
 */
export function SsmContactButton({ ssmId }: { ssmId?: string }) {
  const ssm = findSsm(ssmId);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    if (!ssm) return;
    try {
      await navigator.clipboard.writeText(ssm.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the email is still visible to copy by hand */
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={clsx(
          "flex items-center gap-2 h-10 pl-0.5 pr-3 rounded-full border transition",
          open ? "border-ngt-yellow bg-ngt-yellow/10" : "border-ngt-line hover:border-ngt-yellow"
        )}
      >
        {ssm ? (
          <SsmAvatar ssm={ssm} size="md" />
        ) : (
          <span className="w-9 h-9 rounded-full grid place-items-center bg-ngt-bg text-ngt-muted">
            <LifeBuoy size={15} />
          </span>
        )}
        <span className="text-left leading-tight">
          <span className="block whitespace-nowrap text-[9px] uppercase tracking-widest text-ngt-muted font-semibold">
            {ssm ? "Your SSM" : "Need help?"}
          </span>
          <span className="hidden sm:block whitespace-nowrap text-[12px] font-semibold text-ngt-text">
            {ssm ? ssm.name : "Get support"}
          </span>
        </span>
        <ChevronDown size={14} className={clsx("text-ngt-muted transition", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Your Student Success Manager"
          className="absolute right-0 top-[calc(100%+8px)] w-[300px] max-w-[calc(100vw-2rem)] bg-white border border-ngt-line rounded-lg shadow-lg p-4 z-40"
        >
          <div className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold mb-3">
            Your Student Success Manager
          </div>
          {ssm ? (
            <>
              <div className="flex items-center gap-3">
                <SsmAvatar ssm={ssm} />
                <div className="min-w-0">
                  <div className="font-bold text-sm">{ssm.name}</div>
                  <div className="text-[12px] text-ngt-muted truncate">{ssm.email}</div>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-ngt-muted leading-relaxed">
                Questions about your program, schedule, milestones or certifications? Reach out anytime.
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={`mailto:${ssm.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold uppercase tracking-widest"
                >
                  <Mail size={13} /> Email
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md border border-ngt-line hover:bg-ngt-bg text-[11px] font-bold uppercase tracking-widest text-ngt-muted"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-ngt-muted leading-relaxed">
              You&apos;ll be assigned a Student Success Manager soon. In the meantime, reach out to
              Academic Support.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
