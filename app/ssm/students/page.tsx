import { STUDENTS } from "@/lib/mock-data";
import { StudentRosterTable } from "../_components/student-roster-table";

export default function StudentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Internal · SSM
        </div>
        <h1 className="text-2xl font-black">Students Roster</h1>
        <p className="text-sm text-ngt-muted mt-1">
          Every active student in one filterable view. Click a row for the full progress tree
          and HubSpot fields.
        </p>
      </div>
      <StudentRosterTable students={STUDENTS} />
    </div>
  );
}
