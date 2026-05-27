import { CURRENT_STUDENT_ID, findStudent } from "@/lib/mock-data";
import { DataRow } from "@/components/data-row";
import { formatDate } from "@/lib/format";

export default function StudentProfile() {
  const s = findStudent(CURRENT_STUDENT_ID)!;
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Student
        </div>
        <h1 className="text-2xl font-black">Profile</h1>
      </div>
      <div className="bg-white border border-ngt-line rounded-lg p-5 shadow-card max-w-2xl">
        <DataRow label="Name" value={s.fullName} />
        <DataRow label="Email" value={s.email} />
        <DataRow label="Program of Study" value={s.programOfStudy} />
        <DataRow label="IAU Program Type" value={s.iauProgramType} />
        <DataRow label="NGT Specialization" value={s.ngtSpecialization} />
        <DataRow label="VA Benefit Chapter" value={s.vaBenefitChapter} />
        <DataRow label="IAU School Term" value={s.iauSchoolTerm} />
        <DataRow label="Account Created" value={formatDate(s.accountCreatedDate)} />
      </div>
    </div>
  );
}
