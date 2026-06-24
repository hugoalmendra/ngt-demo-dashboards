import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, School, GraduationCap } from "lucide-react";
import { STUDENTS, findStudent } from "@/lib/mock-data";
import { StatusPill } from "@/components/status-pill";
import { StudentProfileTabs } from "@/components/student-profile-tabs";

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
      </div>

      <StudentProfileTabs student={s} />
    </div>
  );
}
