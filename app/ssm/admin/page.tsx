import Link from "next/link";
import { Award, ChevronRight, ScrollText, Users, Wrench } from "lucide-react";

const TOOLS = [
  {
    href: "/ssm/admin/awards-log",
    title: "Awards Log",
    description:
      "Every certification, certificate of completion (program and course) and recognition award issued, with filters and CSV export.",
    icon: <Award size={18} />,
    ready: true,
  },
  {
    href: "#",
    title: "Users",
    description: "Manage staff and student accounts.",
    icon: <Users size={18} />,
    ready: false,
  },
  {
    href: "#",
    title: "Activity Log",
    description: "Changes made by staff across the LMS.",
    icon: <ScrollText size={18} />,
    ready: false,
  },
  {
    href: "#",
    title: "Settings",
    description: "Programs, cohorts and platform configuration.",
    icon: <Wrench size={18} />,
    ready: false,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Internal · SSM
        </div>
        <h1 className="text-2xl font-black">Admin</h1>
        <p className="text-sm text-ngt-muted mt-1">Admin tools. Only Awards Log is prototyped so far.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 max-w-4xl">
        {TOOLS.map((t) =>
          t.ready ? (
            <Link
              key={t.title}
              href={t.href}
              className="group bg-white border border-ngt-line rounded-lg shadow-card p-5 flex items-start gap-4 hover:border-ngt-yellow transition"
            >
              <ToolBody {...t} />
              <ChevronRight size={18} className="text-ngt-muted group-hover:text-ngt-text mt-1" />
            </Link>
          ) : (
            <div key={t.title} className="bg-white/60 border border-ngt-line rounded-lg p-5 flex items-start gap-4 opacity-60">
              <ToolBody {...t} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-ngt-muted mt-1">Soon</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ToolBody({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <>
      <div className="w-10 h-10 rounded-md bg-ngt-yellow/15 text-ngt-yellowDark grid place-items-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold">{title}</div>
        <p className="text-[13px] text-ngt-muted mt-0.5">{description}</p>
      </div>
    </>
  );
}
