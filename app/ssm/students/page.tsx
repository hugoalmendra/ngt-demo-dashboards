import { STUDENTS } from "@/lib/mock-data";
import { StudentRosterTable } from "../_components/student-roster-table";

export default function StudentsPage() {
  return (
    <div className="space-y-5">
      <StudentRosterTable
        students={STUDENTS}
        eyebrow="Internal · SSM"
        title="Students Roster"
        titleSize="xl"
        description="Every active student in one filterable view. Click a row for the full progress tree and HubSpot fields."
      />
    </div>
  );
}
