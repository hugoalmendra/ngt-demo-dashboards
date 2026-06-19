"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Copy,
  Filter,
  Mail,
  Phone,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import clsx from "clsx";
import type { Student } from "@/lib/types";
import { ProgressBar } from "@/components/progress-bar";
import { StatusPill } from "@/components/status-pill";
import { MilestoneStatusCounts } from "@/components/milestone-status-badge";
import { AddUserModal, type NewUser } from "@/components/add-user-modal";
import { formatShortDate } from "@/lib/format";

const AVATAR_PALETTE = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-fuchsia-500",
];

// Builds a valid Student record from the Add User form so the new person
// shows up in the roster immediately. Progress/cert data starts empty.
function studentFromNewUser(u: NewUser, index: number): Student {
  const fullName = `${u.firstName} ${u.lastName}`.trim();
  const id =
    fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
    `user-${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);
  const addressParts = [
    u.streetAddress,
    [u.city, u.state, u.zipCode].filter(Boolean).join(", "),
    u.country?.toUpperCase(),
  ].filter(Boolean);

  return {
    id: `${id}-${Date.now()}`,
    fullName,
    email: u.email,
    avatarColor: AVATAR_PALETTE[index % AVATAR_PALETTE.length],
    phoneNumber: u.phoneNumber || undefined,
    shippingAddress: addressParts.length ? addressParts.join("\n") : undefined,
    tshirtSize: u.tshirtSize,
    signUpMethod: u.foundUs || undefined,
    programOfStudy: u.iauStudent && u.iauProgramOfStudy ? u.iauProgramOfStudy : "Unassigned",
    iauProgramType: u.iauStudent && u.iauProgramType ? u.iauProgramType : "—",
    ngtSpecialization: "—",
    iauSchoolTerm: u.iauStudent && u.iauTerm ? u.iauTerm : undefined,
    accountCreatedDate: today,
    lastActiveDate: today,
    daysSinceActive: 0,
    hundredDayGoalPct: 0,
    programProgressPct: 0,
    certs: [],
    fsnaDeltaDays: 0,
    progressStatus: "On Track",
    cohort: "Unassigned",
    primaryEnrollmentStatus: "Active",
    program: { id: `${id}-program`, name: "Unassigned", courses: [] },
    milestones: [],
  };
}

interface Props {
  students: Student[];
  eyebrow?: string;
  title?: string;
  description?: string;
  titleSize?: "lg" | "xl";
}

const ALL = "All";

export function StudentRosterTable({
  students,
  eyebrow,
  title,
  description,
  titleSize = "lg",
}: Props) {
  const [roster, setRoster] = useState<Student[]>(students);
  const [addOpen, setAddOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cohort, setCohort] = useState<string>(ALL);
  const [program, setProgram] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [enrollment, setEnrollment] = useState<string>(ALL);
  const [activity, setActivity] = useState<string>(ALL);
  const [moreOpen, setMoreOpen] = useState(false);
  // Tracks which copy button was last pressed and whether it succeeded,
  // for ~2s of inline feedback. Per-button so an error never colors the
  // *other* copy button.
  const [copied, setCopied] = useState<{ kind: "email" | "phone"; ok: boolean } | null>(null);

  const cohorts = useMemo(
    () => [ALL, ...Array.from(new Set(roster.map((s) => s.cohort))).sort()],
    [roster]
  );
  const programs = useMemo(
    () => [ALL, ...Array.from(new Set(roster.map((s) => s.programOfStudy))).sort()],
    [roster]
  );
  const statuses = useMemo(
    () => [ALL, ...Array.from(new Set(roster.map((s) => s.progressStatus)))],
    [roster]
  );
  const enrollmentStatuses = useMemo(
    () => [ALL, ...Array.from(new Set(roster.map((s) => s.primaryEnrollmentStatus)))],
    [roster]
  );

  const activeFilters =
    (cohort !== ALL ? 1 : 0) +
    (program !== ALL ? 1 : 0) +
    (status !== ALL ? 1 : 0) +
    (enrollment !== ALL ? 1 : 0) +
    (activity !== ALL ? 1 : 0) +
    (q.trim() !== "" ? 1 : 0);

  // Secondary filters live in the "More filters" row.
  const secondaryActive =
    (program !== ALL ? 1 : 0) +
    (enrollment !== ALL ? 1 : 0) +
    (activity !== ALL ? 1 : 0);
  // Auto-expand the secondary row if anything inside it is active —
  // never silently hide a filter that's narrowing the list.
  const showSecondary = moreOpen || secondaryActive > 0;

  const clearAll = () => {
    setQ("");
    setCohort(ALL);
    setProgram(ALL);
    setStatus(ALL);
    setEnrollment(ALL);
    setActivity(ALL);
    setMoreOpen(false);
  };

  const rows = useMemo(() => {
    return roster.filter((s) => {
      const matchesQ =
        q.trim() === "" ||
        s.fullName.toLowerCase().includes(q.toLowerCase()) ||
        s.email.toLowerCase().includes(q.toLowerCase()) ||
        s.programOfStudy.toLowerCase().includes(q.toLowerCase());
      const matchesCohort = cohort === ALL || s.cohort === cohort;
      const matchesProgram = program === ALL || s.programOfStudy === program;
      const matchesStatus = status === ALL || s.progressStatus === status;
      const matchesEnrollment =
        enrollment === ALL || s.primaryEnrollmentStatus === enrollment;
      const matchesActivity =
        activity === ALL ||
        (activity === "Active last 7d" && s.daysSinceActive <= 7) ||
        (activity === "Inactive 7–14d" && s.daysSinceActive > 7 && s.daysSinceActive <= 14) ||
        (activity === "Inactive 14d+" && s.daysSinceActive > 14);
      return (
        matchesQ &&
        matchesCohort &&
        matchesProgram &&
        matchesStatus &&
        matchesEnrollment &&
        matchesActivity
      );
    });
  }, [roster, q, cohort, program, status, enrollment, activity]);

  const handleCreate = (user: NewUser) => {
    setRoster((cur) => [studentFromNewUser(user, cur.length), ...cur]);
  };

  // Derived counts for the bulk-copy buttons. Phone count skips students
  // without a phone on file so the displayed number matches what's pasted.
  const emailCount = rows.length;
  const phoneCount = rows.filter((s) => !!s.phoneNumber).length;

  const copyList = async (kind: "email" | "phone") => {
    const items =
      kind === "email"
        ? rows.map((s) => s.email).filter((v): v is string => !!v)
        : rows.map((s) => s.phoneNumber).filter((v): v is string => !!v);
    try {
      await navigator.clipboard.writeText(items.join("\n"));
      setCopied({ kind, ok: true });
    } catch {
      setCopied({ kind, ok: false });
    }
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              {eyebrow}
            </div>
          )}
          {title && (
            <h2
              className={clsx(
                "text-ngt-text",
                titleSize === "xl" ? "text-2xl font-black" : "text-lg font-bold"
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-ngt-muted mt-1 max-w-2xl">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest bg-ngt-yellow hover:bg-ngt-yellowDark text-black transition"
        >
          <UserPlus size={13} /> Add User
        </button>
      </div>

      <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
        {/* TOOLBAR */}
      <div className="border-b border-ngt-line">
        {/* Primary row: search + 2 most-used filters + more-toggle + clear + counter */}
        <div className="px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ngt-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, program..."
              className="h-9 pl-9 pr-3 rounded-md border border-ngt-line text-sm w-[280px] focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
            />
          </div>

          <Filter size={14} className="text-ngt-muted" />

          <FilterSelect label="Status" value={status} onChange={setStatus} options={statuses} />
          <FilterSelect label="Cohort" value={cohort} onChange={setCohort} options={cohorts} />

          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            disabled={secondaryActive > 0}
            title={
              secondaryActive > 0
                ? "Secondary filters are active and stay visible"
                : showSecondary
                ? "Hide secondary filters"
                : "Show secondary filters (Program, Enrollment, Activity)"
            }
            className={clsx(
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[11px] font-semibold uppercase tracking-widest border transition",
              showSecondary
                ? "border-ngt-line bg-ngt-bg text-ngt-text"
                : "border-ngt-line text-ngt-muted hover:text-ngt-text hover:bg-ngt-bg",
              secondaryActive > 0 && "cursor-default"
            )}
          >
            {showSecondary ? "Less filters" : "More filters"}
            {secondaryActive > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-ngt-yellow/20 text-ngt-yellowDark">
                +{secondaryActive}
              </span>
            )}
            <ChevronDown
              size={12}
              className={clsx("transition-transform", showSecondary && "rotate-180")}
            />
          </button>

          {activeFilters > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 h-9 px-2.5 rounded-md text-[11px] font-semibold uppercase tracking-widest text-ngt-muted hover:text-ngt-text border border-transparent hover:border-ngt-line"
            >
              <X size={12} /> Clear ({activeFilters})
            </button>
          )}

          <CopyButton
            kind="email"
            count={emailCount}
            copied={copied}
            onClick={() => copyList("email")}
          />
          <CopyButton
            kind="phone"
            count={phoneCount}
            copied={copied}
            onClick={() => copyList("phone")}
          />

          <div className="ml-auto text-[12px] text-ngt-muted">
            {rows.length} of {roster.length} students
          </div>
        </div>

        {/* Secondary row: situational filters, expanded inline */}
        {showSecondary && (
          <div className="px-4 pt-1 pb-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ngt-line/70 bg-ngt-bg/40">
            <span className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold pr-1">
              More
            </span>
            <FilterSelect
              label="Program"
              value={program}
              onChange={setProgram}
              options={programs}
            />
            <FilterSelect
              label="Enrollment"
              value={enrollment}
              onChange={setEnrollment}
              options={enrollmentStatuses}
            />
            <FilterSelect
              label="Activity"
              value={activity}
              onChange={setActivity}
              options={[ALL, "Active last 7d", "Inactive 7–14d", "Inactive 14d+"]}
            />
          </div>
        )}
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

      {addOpen && (
        <AddUserModal onClose={() => setAddOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}

function CopyButton({
  kind,
  count,
  copied,
  onClick,
}: {
  kind: "email" | "phone";
  count: number;
  copied: { kind: "email" | "phone"; ok: boolean } | null;
  onClick: () => void;
}) {
  const isMe = copied?.kind === kind;
  const isSuccess = isMe && copied!.ok;
  const isError = isMe && !copied!.ok;
  const disabled = count === 0;
  const label = kind === "email" ? "emails" : "phones";
  const Icon = kind === "email" ? Mail : Phone;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={
        disabled
          ? `No ${label} in the current filter`
          : `Copy ${count} ${label} (one per line) to clipboard`
      }
      className={clsx(
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest border transition",
        disabled
          ? "border-ngt-line text-ngt-muted/60 cursor-not-allowed bg-ngt-bg"
          : isSuccess
          ? "border-emerald-500 text-emerald-700 bg-emerald-50"
          : isError
          ? "border-rose-500 text-rose-700 bg-rose-50"
          : "border-ngt-yellow text-ngt-yellowDark hover:bg-ngt-yellow/10"
      )}
    >
      {isSuccess ? (
        <>
          <Check size={12} /> Copied {count} {label}
        </>
      ) : isError ? (
        <>
          <X size={12} /> Copy failed
        </>
      ) : (
        <>
          <Icon size={12} />
          <Copy size={11} className="-ml-0.5 opacity-70" />
          Copy {count} {label}
        </>
      )}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const isActive = value !== ALL;
  return (
    <label className="inline-flex items-center gap-1.5 text-sm">
      <span className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          "h-9 px-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40 max-w-[200px]",
          isActive ? "border-ngt-yellow bg-ngt-yellow/10 font-semibold" : "border-ngt-line"
        )}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
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
