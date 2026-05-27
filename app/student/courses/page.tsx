import { CURRENT_STUDENT_ID, findStudent } from "@/lib/mock-data";
import { ProgressBar } from "@/components/progress-bar";

export default function StudentCourses() {
  const s = findStudent(CURRENT_STUDENT_ID)!;
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Student
        </div>
        <h1 className="text-2xl font-black">My Courses</h1>
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {s.program.courses.map((c) => {
          const avg = Math.round(c.modules.reduce((sum, m) => sum + m.progressPct, 0) / c.modules.length);
          return (
            <li key={c.id} className="bg-white border border-ngt-line rounded-lg p-4 shadow-card">
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
                Course
              </div>
              <div className="font-bold">{c.name}</div>
              <div className="text-[12px] text-ngt-muted mb-3">{c.modules.length} modules</div>
              <ProgressBar value={avg} variant="auto" showLabel />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
