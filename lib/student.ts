import type { Student } from "./types";

/** True when the student is enrolled through IAU (school term or program type on file). */
export function isIauStudent(
  s: Pick<Student, "iauSchoolTerm" | "iauProgramType">
): boolean {
  return !!(
    s.iauSchoolTerm?.trim() ||
    (s.iauProgramType && s.iauProgramType !== "—")
  );
}
