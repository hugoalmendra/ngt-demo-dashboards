import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { CURRENT_STUDENT_ID, findStudent } from "@/lib/mock-data";
import { inferCareerStage } from "@/lib/student";
import { CareerPathPyramid } from "@/components/career-path-pyramid";

export default function StudentCareer() {
  const s = findStudent(CURRENT_STUDENT_ID)!;
  const currentStage = inferCareerStage(s);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Student · Career Success
        </div>
        <h1 className="text-2xl font-black">Your IT career path</h1>
        <p className="text-sm text-ngt-muted mt-1 max-w-2xl">
          See where you are today and what comes next — from your first certification to
          senior roles and beyond. Click any stage or pyramid level to explore.
        </p>
      </div>

      <CareerPathPyramid initialStage={currentStage} currentStage={currentStage} />

      <div className="bg-white border border-ngt-line rounded-lg shadow-card px-5 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-ngt-yellow/15 text-ngt-yellowDark grid place-items-center shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="font-bold text-sm">Keep building momentum</div>
            <p className="text-[13px] text-ngt-muted mt-0.5">
              Your program progress and certifications move you up this path.
            </p>
          </div>
        </div>
        <Link
          href="/student/programs"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest bg-ngt-yellow hover:bg-ngt-yellowDark text-black transition"
        >
          Continue learning <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
