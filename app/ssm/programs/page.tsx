import { STUDENTS } from "@/lib/mock-data";

export default function ProgramsPage() {
  const programs = Array.from(
    new Map(STUDENTS.map((s) => [s.program.id, s.program])).values()
  );
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Internal · SSM
        </div>
        <h1 className="text-2xl font-black">Programs</h1>
        <p className="text-sm text-ngt-muted mt-1">
          Curriculum structure used to compute hierarchical progress.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {programs.map((p) => (
          <div key={p.id} className="bg-white border border-ngt-line rounded-lg p-5 shadow-card">
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
              Program
            </div>
            <h3 className="font-bold mb-2">{p.name}</h3>
            <div className="text-[12px] text-ngt-muted mb-3">
              {p.courses.length} courses · {p.courses.reduce((s, c) => s + c.modules.length, 0)}{" "}
              modules
            </div>
            <ul className="text-sm space-y-1">
              {p.courses.map((c) => (
                <li key={c.id} className="text-ngt-text">
                  • {c.name}{" "}
                  <span className="text-ngt-muted text-[11px]">({c.modules.length} modules)</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
