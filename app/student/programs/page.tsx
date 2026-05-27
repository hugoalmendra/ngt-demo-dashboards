import { CURRENT_STUDENT_ID, findStudent } from "@/lib/mock-data";
import { ProgramTree } from "@/components/program-tree";

export default function StudentPrograms() {
  const s = findStudent(CURRENT_STUDENT_ID)!;
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Student
        </div>
        <h1 className="text-2xl font-black">My Programs</h1>
      </div>
      <ProgramTree program={s.program} friendly />
    </div>
  );
}
