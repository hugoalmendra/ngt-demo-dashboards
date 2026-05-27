import Link from "next/link";
import { STUDENTS } from "@/lib/mock-data";

export default function CohortsPage() {
  const grouped = STUDENTS.reduce<Record<string, number>>((acc, s) => {
    acc[s.cohort] = (acc[s.cohort] ?? 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(grouped);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Internal · SSM
        </div>
        <h1 className="text-2xl font-black">Cohorts</h1>
        <p className="text-sm text-ngt-muted mt-1">
          Cohort rollups · click into a cohort to filter the roster (placeholder).
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([cohort, count]) => (
          <Link
            key={cohort}
            href="/ssm/students"
            className="bg-white border border-ngt-line rounded-lg p-5 shadow-card hover:border-ngt-yellow transition"
          >
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
              Cohort
            </div>
            <div className="font-bold text-lg">{cohort}</div>
            <div className="text-[12px] text-ngt-muted mt-2">{count} students</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
