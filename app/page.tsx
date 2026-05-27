import Link from "next/link";
import { ArrowRight, GraduationCap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-ngt-ink text-white grid place-items-center px-6">
      <div className="max-w-3xl w-full">
        <div className="flex items-center gap-3 mb-10">
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ngt-icon.png`} alt="NGT.Academy" className="w-11 h-11 object-contain" />
          <div className="text-xl font-bold tracking-wide">NGT.ACADEMY</div>
          <span className="text-[11px] uppercase tracking-widest text-white/40 ml-2 border border-white/15 px-2 py-1 rounded">
            Dashboards Prototype
          </span>
        </div>

        <h1 className="text-4xl font-black mb-3 leading-tight">
          Native LMS Dashboards <span className="text-ngt-yellow">·</span> Prototype
        </h1>
        <p className="text-white/60 mb-10 max-w-xl">
          Two real-time views built natively in the LMS — bypassing HubSpot, Spat V2 and
          nightly Metabase syncs. Pick a perspective to preview.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/ssm"
            className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg p-6 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-md bg-ngt-yellow text-black grid place-items-center">
                <Users size={20} />
              </div>
              <ArrowRight size={18} className="text-white/40 group-hover:text-ngt-yellow transition" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              Internal view
            </div>
            <div className="text-lg font-bold mb-2">SSM Dashboard</div>
            <div className="text-sm text-white/60">
              Live student roster, certs, FSNA delta, 100-day goal, HubSpot fields — all in
              one place. No more tab-jumping.
            </div>
          </Link>

          <Link
            href="/student"
            className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg p-6 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-md bg-ngt-yellow text-black grid place-items-center">
                <GraduationCap size={20} />
              </div>
              <ArrowRight size={18} className="text-white/40 group-hover:text-ngt-yellow transition" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              Student view
            </div>
            <div className="text-lg font-bold mb-2">My Progress</div>
            <div className="text-sm text-white/60">
              Tree view of Program → Course → Module. Crystal clear about what each
              percentage actually means.
            </div>
          </Link>
        </div>

        <div className="mt-10 text-[11px] text-white/30 uppercase tracking-widest">
          Prototype · placeholder data · for design alignment
        </div>
      </div>
    </div>
  );
}
