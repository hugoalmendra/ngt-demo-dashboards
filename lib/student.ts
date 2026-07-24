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

/** Rough career-path stage (1–7) from certs and program progress. */
export function inferCareerStage(s: Pick<Student, "certs" | "programProgressPct">): number {
  const earned = new Set(s.certs.filter((c) => c.earned).map((c) => c.code));
  if (earned.has("FSNP") || earned.has("NCSA")) return 3;
  if (earned.has("NetworkPlus") || earned.has("CCNA") || earned.has("SecurityPlus")) return 2;
  if (s.programProgressPct >= 40) return 2;
  if (s.programProgressPct >= 10) return 1;
  return 1;
}
