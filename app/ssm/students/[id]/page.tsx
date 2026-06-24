import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { STUDENTS, findStudent } from "@/lib/mock-data";
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

      <StudentProfileTabs student={s} />
    </div>
  );
}
