import { Award, BookOpen, CalendarDays, Flag, GraduationCap, Target, Trophy } from "lucide-react";
import { CURRENT_STUDENT_ID, findStudent } from "@/lib/mock-data";
import { ProgramTree } from "@/components/program-tree";
import { ProgressBar } from "@/components/progress-bar";
import { CertBadge } from "@/components/cert-badge";
import { StatusPill } from "@/components/status-pill";
import { MilestoneList } from "@/components/milestone-list";
import { EnrollmentCard } from "@/components/enrollment-card";
import { ExtendDueDatesButton } from "@/components/extend-due-dates-button";
import { formatDate } from "@/lib/format";
import { isIauStudent } from "@/lib/student";

export default function StudentDashboard() {
  const s = findStudent(CURRENT_STUDENT_ID)!;
  const certsEarned = s.certs.filter((c) => c.earned).length;
  const certsInProgress = s.certs.filter((c) => !c.earned && c.progressPct > 0).length;
  const milestonesOverdue = s.milestones.filter((m) => m.status === "Overdue").length;
  const milestonesSentBack = s.milestones.filter((m) => m.status === "Sent Back").length;
  const milestonesActionNeeded = milestonesOverdue + milestonesSentBack;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-5">
          <div className={`w-16 h-16 rounded-full grid place-items-center text-white text-xl font-bold ${s.avatarColor}`}>
            {s.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Welcome back
            </div>
            <h1 className="text-2xl font-black">{s.fullName}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ngt-muted mt-1">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={12} /> {s.programOfStudy}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={12} /> {s.iauSchoolTerm}
              </span>
              <StatusPill status={s.progressStatus} />
            </div>
          </div>
          <button className="hidden md:flex bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold tracking-widest px-4 h-10 rounded-md items-center gap-2">
            <BookOpen size={14} /> RESUME LEARNING
          </button>
        </div>

        {/* HEADLINE PROGRESS — make it crystal clear what this % is */}
        <div className="px-6 py-5 bg-ngt-bg/50 border-t border-ngt-line">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/3">
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
                Overall program progress
              </div>
              <div className="text-4xl font-black tabular-nums leading-tight">
                {s.programProgressPct}%
              </div>
              <div className="text-[12px] text-ngt-muted">
                of <span className="font-semibold text-ngt-text">{s.programOfStudy}</span>
              </div>
            </div>
            <div className="flex-1">
              <ProgressBar value={s.programProgressPct} size="lg" variant="yellow" />
              <div className="flex justify-between text-[11px] text-ngt-muted mt-2">
                <span>Started {formatDate(s.semesterStartDate)}</span>
                <span>Target {formatDate(s.semesterEndDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS — friendly to students */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StudentStat
          icon={<Target size={16} />}
          label="100-Day Goal"
          value={`${s.hundredDayGoalPct}%`}
          help="Your commitment milestone"
          tone="yellow"
        />
        <StudentStat
          icon={<Trophy size={16} />}
          label="Certs Earned"
          value={`${certsEarned}`}
          help={`${certsInProgress} more in progress`}
          tone="green"
        />
        <StudentStat
          icon={<Flag size={16} />}
          label="Milestones"
          value={`${milestonesActionNeeded}`}
          help={
            milestonesActionNeeded === 0
              ? "All caught up — nice work!"
              : `${milestonesOverdue} overdue · ${milestonesSentBack} sent back`
          }
          tone={milestonesActionNeeded > 0 ? "red" : "green"}
        />
        <StudentStat
          icon={<Award size={16} />}
          label="Status"
          value={s.progressStatus}
          help={
            s.fsnaDeltaDays >= 0
              ? `You're ${s.fsnaDeltaDays} day(s) ahead — keep it up!`
              : `${Math.abs(s.fsnaDeltaDays)} day(s) behind plan — let's adjust.`
          }
          tone={s.fsnaDeltaDays >= 0 ? "green" : "red"}
        />
      </div>

      {/* CLARIFIED TREE */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Your path
            </div>
            <h2 className="text-lg font-bold">Program → Course → Module</h2>
          </div>
          <span className="text-[11px] text-ngt-muted">
            Expand a course to see module-level progress
          </span>
        </div>
        <ProgramTree program={s.program} friendly />
        <p className="text-[11px] text-ngt-muted mt-2 max-w-2xl">
          Each percentage shows progress for that specific level.{" "}
          <span className="font-semibold text-ngt-text">Module</span> = a single unit,{" "}
          <span className="font-semibold text-ngt-text">Course</span> = the average of its
          modules, <span className="font-semibold text-ngt-text">Program</span> = the average
          of all modules across all courses.
        </p>
      </section>

      {/* MILESTONES */}
      <section>
        <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Submissions
            </div>
            <h2 className="text-lg font-bold">Your milestones</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-ngt-muted hidden sm:inline">
              Reviewed manually by instructors and coaches
            </span>
            {!isIauStudent(s) && <ExtendDueDatesButton milestones={s.milestones} />}
          </div>
        </div>
        <MilestoneList milestones={s.milestones} variant="student" title="Action items & submissions" />
      </section>

      {/* CERTS */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
              Industry certifications
            </div>
            <h2 className="text-lg font-bold">Your certifications</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {s.certs.map((c) => (
            <CertBadge key={c.code} cert={c} />
          ))}
        </div>
      </section>

      {/* OTHER ENROLLMENTS */}
      {s.additionalEnrollments && s.additionalEnrollments.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
                Your enrollments
              </div>
              <h2 className="text-lg font-bold">
                Other programs & add-on courses ({s.additionalEnrollments.length})
              </h2>
            </div>
            <span className="text-[11px] text-ngt-muted">
              Click to expand the curriculum and milestones
            </span>
          </div>
          <div className="space-y-3">
            {s.additionalEnrollments.map((e) => (
              <EnrollmentCard key={e.id} enrollment={e} variant="student" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StudentStat({
  icon,
  label,
  value,
  help,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  help: string;
  tone: "yellow" | "green" | "blue" | "red";
}) {
  const accents: Record<typeof tone, string> = {
    yellow: "bg-ngt-yellow/15 text-ngt-yellowDark",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    red: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white border border-ngt-line rounded-lg p-4 shadow-card">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-md grid place-items-center ${accents[tone]}`}>{icon}</div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
          {label}
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-[12px] text-ngt-muted mt-1">{help}</div>
    </div>
  );
}
