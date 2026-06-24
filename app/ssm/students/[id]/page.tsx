import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Mail,
  Phone,
  Target,
  Clock,
  Calendar,
  GraduationCap,
  School,
  Activity,
  Flag,
  Contact,
  MapPin,
  Shirt,
  UserPlus,
} from "lucide-react";
import { STUDENTS, findStudent } from "@/lib/mock-data";
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

export function generateStaticParams() {
  return STUDENTS.map((s) => ({ id: s.id }));
}

export default function StudentDetail({ params }: { params: { id: string } }) {
  const s = findStudent(params.id);
  if (!s) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/ssm/students"
        className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest font-semibold text-ngt-muted hover:text-ngt-text"
      >
        <ChevronLeft size={14} /> Back to roster
      </Link>

      {/* HEADER CARD */}
      <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-5 flex items-start gap-5">
          <div className={`w-16 h-16 rounded-full grid place-items-center text-white text-xl font-bold ${s.avatarColor}`}>
            {s.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black">{s.fullName}</h1>
              <StatusPill status={s.progressStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ngt-muted mt-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} /> {s.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <School size={12} /> {s.cohort}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={12} /> {s.programOfStudy}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold tracking-widest px-4 h-9 rounded-md">
              SEND EMAIL
            </button>
            <button className="bg-white border border-ngt-line text-[11px] font-bold tracking-widest px-4 h-9 rounded-md hover:bg-ngt-bg">
              SCHEDULE CALL
            </button>
          </div>
        </div>

        {/* AT-A-GLANCE STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-6 py-5 bg-ngt-bg/50 border-t border-ngt-line">
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
            value={`${s.milestones.filter((m) => m.status === "Ready for Review").length + s.milestones.filter((m) => m.status === "Overdue").length}`}
            sub={`${s.milestones.filter((m) => m.status === "Ready for Review").length} ready · ${s.milestones.filter((m) => m.status === "Overdue").length} overdue`}
            accent={
              s.milestones.some((m) => m.status === "Overdue" || m.status === "Ready for Review")
                ? "red"
                : "neutral"
            }
            icon={<Flag size={14} />}
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — TREE PROGRESS */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
                  Active program · hierarchical progress
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <h2 className="text-lg font-bold">Program → Course → Module</h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full ${ENROLLMENT_STATUS_STYLES[s.primaryEnrollmentStatus]}`}
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
            <MilestoneList milestones={s.milestones} variant="ssm" title="Click a milestone to review or change status" />
          </section>

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

        {/* RIGHT — DATA PANELS */}
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
      </div>
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

