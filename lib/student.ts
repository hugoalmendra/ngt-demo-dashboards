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
  if (earned.has("FSNA")) return 2;
  if (s.programProgressPct >= 40) return 2;
  if (s.programProgressPct >= 10) return 1;
  return 1;
}

/**
 * Career-path stages the student has completed. Only Stage 01 is tracked for
 * now: it is complete once the FSNA certification is earned.
 */
export function completedCareerStages(s: Pick<Student, "certs">): number[] {
  const fsna = s.certs.find((c) => c.code === "FSNA");
  return fsna?.earned ? [1] : [];
}

export const FSNA_GOAL_DAYS = 100;

export type FsnaGoal =
  | { state: "earned"; earnedAt?: string; daysTaken?: number }
  | { state: "in-progress" | "past-due"; pct: number; day?: number; dueDate?: string };

/**
 * The 100-Day Goal: students have 100 days from their term start to complete
 * the FSNA. Baseline is the term start (NGT-76), falling back to the primary
 * enrollment start — never account creation.
 */
export function fsnaGoal(
  s: Pick<Student, "certs" | "hundredDayGoalPct" | "semesterStartDate" | "primaryOrder">,
  today = new Date()
): FsnaGoal {
  const DAY = 86_400_000;
  const startIso = s.semesterStartDate ?? s.primaryOrder?.startDate;
  const start = startIso ? new Date(startIso) : undefined;
  const fsna = s.certs.find((c) => c.code === "FSNA");

  if (fsna?.earned) {
    const daysTaken =
      start && fsna.issuedAt
        ? Math.max(1, Math.round((new Date(fsna.issuedAt).getTime() - start.getTime()) / DAY))
        : undefined;
    return { state: "earned", earnedAt: fsna.issuedAt, daysTaken };
  }

  if (!start) return { state: "in-progress", pct: s.hundredDayGoalPct };
  const day = Math.max(1, Math.floor((today.getTime() - start.getTime()) / DAY) + 1);
  const dueDate = new Date(start.getTime() + FSNA_GOAL_DAYS * DAY).toISOString().slice(0, 10);
  return {
    state: day > FSNA_GOAL_DAYS ? "past-due" : "in-progress",
    pct: s.hundredDayGoalPct,
    day,
    dueDate,
  };
}
