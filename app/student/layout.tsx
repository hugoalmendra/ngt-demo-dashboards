import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { StudentMobileNav } from "@/components/student-mobile-nav";
import { CURRENT_STUDENT_ID, findStudent } from "@/lib/mock-data";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const student = findStudent(CURRENT_STUDENT_ID);
  return (
    <div className="flex min-h-screen bg-ngt-bg">
      <Sidebar variant="student" />
      <div className="flex-1 flex flex-col min-w-0">
        <StudentMobileNav ssmId={student?.assignedSsmId} studentName={student?.fullName ?? ""} />
        <Topbar
          ctaLabel="REPORT SUCCESS"
          studentSsmId={student?.assignedSsmId ?? null}
          className="hidden md:flex"
        />
        <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
