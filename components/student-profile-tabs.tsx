"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Activity,
  Award,
  Clock,
  Contact,
  Flag,
  GraduationCap,
  Pencil,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import type { Milestone, ProgramEnrollment, Student } from "@/lib/types";
import { StatusPill } from "@/components/status-pill";
import { ProgressBar } from "@/components/progress-bar";
import { ProgramTree } from "@/components/program-tree";
import { CertBadge } from "@/components/cert-badge";
import { DataRow } from "@/components/data-row";
import { StatCard } from "@/components/stat-card";
import { MilestoneList } from "@/components/milestone-list";
import { EnrollmentCard } from "@/components/enrollment-card";
import { ViewOrderButton } from "@/components/view-order-button";
import { IauProgramDetailsPanel } from "@/components/iau-program-details-panel";
import { formatDate, formatDelta } from "@/lib/format";

const ENROLLMENT_STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Paused: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Expired: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  Completed: "bg-ngt-yellow/15 text-ngt-yellowDark ring-1 ring-ngt-yellow/40",
};

const ENROLLMENT_STATUS_TEXT: Record<string, string> = {
  Active: "text-emerald-600",
  Paused: "text-amber-600",
  Expired: "text-rose-600",
  Completed: "text-ngt-yellowDark",
};

const MILESTONE_DOT_STYLES: Record<string, string> = {
  Complete: "bg-emerald-500 text-white",
  "Ready for Review": "bg-amber-400 text-black",
  Overdue: "bg-rose-500 text-white",
  "Sent Back": "bg-orange-400 text-white",
  Incomplete: "bg-ngt-bg text-ngt-muted ring-1 ring-ngt-line",
};

type TabKey = "profile" | "data" | "log" | "referral";

const TABS: { key: TabKey; label: string; disabled?: boolean }[] = [
  { key: "profile", label: "Profile" },
  { key: "data", label: "Data Tracking" },
  { key: "log", label: "Log", disabled: true },
  { key: "referral", label: "Refer a Friend", disabled: true },
];

export function StudentProfileTabs({ student: s }: { student: Student }) {
  const [tab, setTab] = useState<TabKey>("profile");

  const readyForReview = s.milestones.filter((m) => m.status === "Ready for Review").length;
  const overdue = s.milestones.filter((m) => m.status === "Overdue").length;

  return (
    <div className="space-y-6">
      {/* TAB BAR */}
      <div className="border-b border-ngt-line">
        <div className="flex items-center gap-6">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                disabled={t.disabled}
                onClick={() => !t.disabled && setTab(t.key)}
                className={clsx(
                  "relative py-3 text-[12px] font-bold uppercase tracking-widest transition",
                  t.disabled
                    ? "text-ngt-muted/40 cursor-not-allowed"
                    : active
                    ? "text-ngt-text"
                    : "text-ngt-muted hover:text-ngt-text"
                )}
              >
                {t.label}
                {active && !t.disabled && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ngt-yellow rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "profile" && <ProfileTab s={s} />}
      {tab === "data" && (
        <DataTrackingTab
          s={s}
          readyForReview={readyForReview}
          overdue={overdue}
        />
      )}
    </div>
  );
}

function ProfileTab({ s }: { s: Student }) {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-6">
        <Panel title="Contact" icon={<Contact size={14} />}>
          <DataRow label="Email" value={s.email} />
          <DataRow label="Phone Number" value={s.phoneNumber} />
          <DataRow
            label="Shipping Address"
            value={
              s.shippingAddress ? (
                <span className="whitespace-pre-line leading-snug">{s.shippingAddress}</span>
              ) : (
                "—"
              )
            }
          />
          <DataRow label="T-Shirt Size" value={s.tshirtSize} />
          <DataRow label="Sign-up Method" value={s.signUpMethod} />
        </Panel>

        <Panel title="100-Day Goal" icon={<Target size={14} />}>
          <div className="py-2">
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-sm font-semibold">Progress</div>
              <div className="text-xl font-black tabular-nums">{s.hundredDayGoalPct}%</div>
            </div>
            <ProgressBar value={s.hundredDayGoalPct} variant="yellow" />
            <p className="text-[12px] text-ngt-muted mt-2 leading-snug">
              Tracks the student's commitment to complete their planned milestones within
              100 days of enrollment.
            </p>
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <IauProgramDetailsPanel
          details={{
            programOfStudy: s.programOfStudy,
            iauProgramType: s.iauProgramType,
            ngtSpecialization: s.ngtSpecialization,
            iauSchoolTerm: s.iauSchoolTerm ?? "",
          }}
          dates={{
            semesterStartDate: s.semesterStartDate,
            semesterEndDate: s.semesterEndDate,
            recentDealCloseDate: s.recentDealCloseDate,
            accountCreatedDate: s.accountCreatedDate,
            lastActiveDate: s.lastActiveDate,
            daysSinceActive: s.daysSinceActive,
          }}
        />
      </div>
      </div>

      <ProductEnrollmentSection s={s} />
      <AwardsSection />
    </div>
  );
}

function ProductEnrollmentSection({ s }: { s: Student }) {
  return (
    <section>
      <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-3">
        Product Enrollment
      </div>
      <div className="bg-white border border-ngt-line rounded-lg shadow-card divide-y divide-ngt-line">
        <EnrollmentRow
          name={s.programOfStudy}
          cohort={s.cohort}
          milestones={s.milestones}
          status={s.primaryEnrollmentStatus}
          order={s.primaryOrder}
        />
        {s.additionalEnrollments?.map((e) => (
          <EnrollmentRow
            key={e.id}
            name={e.name}
            cohort={e.cohort}
            milestones={e.milestones ?? []}
            status={e.status}
            order={e.order}
          />
        ))}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest bg-ngt-yellow hover:bg-ngt-yellowDark text-black transition"
      >
        <Plus size={13} /> Add-on Product (Sales)
      </button>
    </section>
  );
}

function EnrollmentRow({
  name,
  cohort,
  milestones,
  status,
  order,
}: {
  name: string;
  cohort: string;
  milestones: Milestone[];
  status: ProgramEnrollment["status"];
  order?: ProgramEnrollment["order"];
}) {
  return (
    <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-[1.6fr_1.2fr_1.4fr_0.8fr_auto] gap-4 items-center">
      <Cell label="Name">
        <div className="font-semibold text-sm leading-snug">{name}</div>
      </Cell>
      <Cell label="Cohort">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="truncate">{cohort}</span>
          <button
            type="button"
            aria-label="Edit cohort"
            className="text-ngt-muted hover:text-ngt-yellowDark shrink-0"
          >
            <Pencil size={12} />
          </button>
        </div>
      </Cell>
      <Cell label="Milestones">
        {milestones.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {milestones.map((m, i) => (
              <span
                key={m.id}
                title={`${m.name} — ${m.status}`}
                className={clsx(
                  "w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold",
                  MILESTONE_DOT_STYLES[m.status] ?? MILESTONE_DOT_STYLES.Incomplete
                )}
              >
                {i + 1}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-ngt-muted">—</span>
        )}
      </Cell>
      <Cell label="Status">
        <span className={clsx("text-sm font-semibold", ENROLLMENT_STATUS_TEXT[status])}>
          {status}
        </span>
      </Cell>
      <div className="flex items-center gap-2 justify-start md:justify-end">
        {order ? (
          <ViewOrderButton productName={name} status={status} order={order} />
        ) : (
          <span className="text-[11px] text-ngt-muted">No order</span>
        )}
        <button
          type="button"
          aria-label="Remove enrollment"
          className="w-9 h-9 grid place-items-center rounded-md border border-ngt-line text-ngt-muted hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function AwardsSection() {
  return (
    <section>
      <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-3">
        Awards
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest bg-ngt-yellow hover:bg-ngt-yellowDark text-black transition"
      >
        <Award size={13} /> Issue Cert or Award
      </button>
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

function DataTrackingTab({
  s,
  readyForReview,
  overdue,
}: {
  s: Student;
  readyForReview: number;
  overdue: number;
}) {
  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW */}
      <section>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-3">
          Stats Overview
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <StatCard
            label="Program Progress"
            value={`${s.programProgressPct}%`}
            sub={s.programOfStudy}
            accent="yellow"
            icon={<GraduationCap size={14} />}
          />
          <StatCard
            label="100-Day Goal"
            value={`${s.hundredDayGoalPct}%`}
            sub="Toward target"
            accent="yellow"
            icon={<Target size={14} />}
          />
          <StatCard
            label="FSNA Delta"
            value={
              <span className={s.fsnaDeltaDays < 0 ? "text-rose-600" : "text-emerald-600"}>
                {s.fsnaDeltaDays > 0 ? "+" : ""}
                {s.fsnaDeltaDays}d
              </span>
            }
            sub={formatDelta(s.fsnaDeltaDays)}
            accent={s.fsnaDeltaDays < 0 ? "red" : "green"}
            icon={<Activity size={14} />}
          />
          <StatCard
            label="Days Since Active"
            value={`${s.daysSinceActive}d`}
            sub={`Last login ${formatDate(s.lastActiveDate)}`}
            accent={s.daysSinceActive >= 14 ? "red" : s.daysSinceActive >= 7 ? "yellow" : "green"}
            icon={<Clock size={14} />}
          />
          <StatCard
            label="Needs Your Review"
            value={`${readyForReview + overdue}`}
            sub={`${readyForReview} ready · ${overdue} overdue`}
            accent={readyForReview + overdue > 0 ? "red" : "neutral"}
            icon={<Flag size={14} />}
          />
        </div>
      </section>

      {/* STUDENT PROGRESS */}
      <section>
        <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Student Progress · hierarchical
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <h2 className="text-lg font-bold">Program → Course → Module</h2>
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full",
                  ENROLLMENT_STATUS_STYLES[s.primaryEnrollmentStatus]
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {s.primaryEnrollmentStatus} enrollment
              </span>
            </div>
          </div>
          <ViewOrderButton
            productName={s.programOfStudy}
            status={s.primaryEnrollmentStatus}
            order={s.primaryOrder}
          />
        </div>
        <ProgramTree program={s.program} />
      </section>

      {/* MILESTONES */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Submissions & reviews
            </div>
            <h2 className="text-lg font-bold">Milestones</h2>
          </div>
          <span className="text-[11px] text-ngt-muted">
            Sorted by priority: Overdue → Ready for Review → Sent Back
          </span>
        </div>
        <MilestoneList
          milestones={s.milestones}
          variant="ssm"
          title="Click a milestone to review or change status"
        />
      </section>

      {/* OTHER ENROLLMENTS */}
      {s.additionalEnrollments && s.additionalEnrollments.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
                History & add-ons
              </div>
              <h2 className="text-lg font-bold">
                Other enrollments ({s.additionalEnrollments.length})
              </h2>
            </div>
            <span className="text-[11px] text-ngt-muted">
              Completed prior programs and additional courses
            </span>
          </div>
          <div className="space-y-3">
            {s.additionalEnrollments.map((e) => (
              <EnrollmentCard key={e.id} enrollment={e} variant="ssm" />
            ))}
          </div>
        </section>
      )}

      {/* CERT TRACKER */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Industry certifications
            </div>
            <h2 className="text-lg font-bold">Cert Tracker</h2>
          </div>
          <span className="text-[11px] text-ngt-muted">
            Sourced from LMS + cert issuance log
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {s.certs.map((c) => (
            <CertBadge key={c.code} cert={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-ngt-line rounded-lg shadow-card">
      <header className="px-4 py-3 border-b border-ngt-line">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-6 h-6 rounded bg-ngt-bg text-ngt-muted grid place-items-center">
              {icon}
            </div>
          )}
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
        {subtitle && <p className="text-[11px] text-ngt-muted mt-1">{subtitle}</p>}
      </header>
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}
