import Link from "next/link";
import { Users, AlertTriangle, Award, Calendar, ArrowRight, TrendingUp, Flag } from "lucide-react";
import { STUDENTS } from "@/lib/mock-data";
import { StatCard } from "@/components/stat-card";
import { StudentRosterTable } from "./_components/student-roster-table";

export default function SsmDashboard() {
  const total = STUDENTS.length;
  const atRisk = STUDENTS.filter((s) => s.progressStatus === "At Risk" || s.progressStatus === "Behind").length;
  const onTrack = STUDENTS.filter((s) => s.progressStatus === "On Track" || s.progressStatus === "Ahead").length;
  const completed = STUDENTS.filter((s) => s.progressStatus === "Completed").length;
  const inactive7d = STUDENTS.filter((s) => s.daysSinceActive >= 7).length;
  const allMilestones = STUDENTS.flatMap((s) => s.milestones);
  const milestonesReady = allMilestones.filter((m) => m.status === "Ready for Review").length;
  const milestonesOverdue = allMilestones.filter((m) => m.status === "Overdue").length;
  const needsReview = milestonesReady + milestonesOverdue;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
            Internal · SSM Workspace
          </div>
          <h1 className="text-2xl font-black">Live Student Dashboard</h1>
          <p className="text-sm text-ngt-muted mt-1">
            Real-time view across all cohorts · pulled natively from the LMS (no HubSpot, no Spat V2, no nightly Metabase syncs).
          </p>
        </div>
        <Link
          href="/ssm/students"
          className="text-[12px] font-semibold uppercase tracking-widest text-ngt-text bg-white border border-ngt-line rounded-md px-4 h-9 flex items-center gap-2 hover:bg-ngt-bg"
        >
          View full roster <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Active Students" value={total} icon={<Users size={14} />} accent="blue" />
        <StatCard
          label="On Track / Ahead"
          value={onTrack}
          sub={`${Math.round((onTrack / total) * 100)}% of roster`}
          accent="green"
          icon={<TrendingUp size={14} />}
        />
        <StatCard
          label="Behind / At Risk"
          value={atRisk}
          sub="Needs SSM follow-up"
          accent="red"
          icon={<AlertTriangle size={14} />}
        />
        <StatCard
          label="Inactive ≥ 7 days"
          value={inactive7d}
          sub="No login in last week"
          accent="yellow"
          icon={<Calendar size={14} />}
        />
        <StatCard
          label="Milestones to Review"
          value={needsReview}
          sub={`${milestonesReady} ready · ${milestonesOverdue} overdue`}
          accent={needsReview > 0 ? "red" : "green"}
          icon={<Flag size={14} />}
        />
        <StatCard
          label="Completed Programs"
          value={completed}
          sub="Lifetime"
          accent="green"
          icon={<Award size={14} />}
        />
      </div>

      {/* PRIORITY FOLLOW-UPS */}
      <section className="bg-white border border-ngt-line rounded-lg shadow-card">
        <header className="px-5 py-3 border-b border-ngt-line flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Priority follow-ups
            </div>
            <h2 className="font-bold">Students who need a check-in today</h2>
          </div>
          <span className="text-[11px] text-ngt-muted">
            Sorted by FSNA Delta (most behind first)
          </span>
        </header>
        <ul className="divide-y divide-ngt-line">
          {[...STUDENTS]
            .sort((a, b) => a.fsnaDeltaDays - b.fsnaDeltaDays)
            .slice(0, 4)
            .map((s) => (
              <li key={s.id} className="px-5 py-3 flex items-center gap-4 hover:bg-ngt-bg/40">
                <div className={`w-9 h-9 rounded-full grid place-items-center text-white text-xs font-bold ${s.avatarColor}`}>
                  {s.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/ssm/students/${s.id}`}
                    className="font-semibold text-sm hover:text-ngt-yellowDark"
                  >
                    {s.fullName}
                  </Link>
                  <div className="text-[12px] text-ngt-muted">
                    {s.programOfStudy} · {s.cohort}
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-[10px] uppercase tracking-widest text-ngt-muted">
                    Last active
                  </div>
                  <div className="text-sm font-semibold tabular-nums">
                    {s.daysSinceActive}d ago
                  </div>
                </div>
                <div className="text-right w-[110px]">
                  <div className="text-[10px] uppercase tracking-widest text-ngt-muted">
                    FSNA Delta
                  </div>
                  <div
                    className={`text-sm font-bold tabular-nums ${
                      s.fsnaDeltaDays < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {s.fsnaDeltaDays > 0 ? "+" : ""}
                    {s.fsnaDeltaDays}d
                  </div>
                </div>
                <Link
                  href={`/ssm/students/${s.id}`}
                  className="text-[11px] font-semibold uppercase tracking-widest bg-ngt-yellow hover:bg-ngt-yellowDark text-black px-3 h-8 rounded-md flex items-center gap-1"
                >
                  Open <ArrowRight size={12} />
                </Link>
              </li>
            ))}
        </ul>
      </section>

      {/* ROSTER TABLE PREVIEW */}
      <section>
        <StudentRosterTable students={STUDENTS} eyebrow="Roster" title="All students" />
      </section>
    </div>
  );
}
