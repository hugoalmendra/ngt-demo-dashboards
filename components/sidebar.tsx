"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Library,
  FolderKanban,
  Users,
  Briefcase,
  Settings,
  PlusCircle,
  Building2,
  UserCircle2,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const SSM_NAV: NavItem[] = [
  { href: "/ssm", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/ssm/students", label: "Students", icon: <Users size={18} /> },
  { href: "/ssm/cohorts", label: "Cohorts", icon: <Building2 size={18} /> },
  { href: "/ssm/programs", label: "Programs", icon: <GraduationCap size={18} /> },
  { href: "/ssm/reports", label: "Reports", icon: <BarChart3 size={18} /> },
  { href: "/ssm/admin", label: "Admin", icon: <Settings size={18} /> },
];

const STUDENT_NAV: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/student/programs", label: "Programs", icon: <GraduationCap size={18} /> },
  { href: "/student/courses", label: "Courses", icon: <Library size={18} /> },
  { href: "/student/projects", label: "Projects", icon: <FolderKanban size={18} /> },
  { href: "/student/community", label: "Community", icon: <Users size={18} /> },
  { href: "/student/career", label: "Career Success", icon: <Briefcase size={18} /> },
  { href: "/student/profile", label: "Profile", icon: <UserCircle2 size={18} /> },
];

export function Sidebar({ variant }: { variant: "ssm" | "student" }) {
  const pathname = usePathname();
  const nav = variant === "ssm" ? SSM_NAV : STUDENT_NAV;

  return (
    <aside className="w-[220px] shrink-0 bg-ngt-ink text-white flex flex-col min-h-screen sticky top-0">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ngt-icon.png`} alt="NGT.Academy" className="w-9 h-9 object-contain" />
          <div className="leading-tight">
            <div className="font-bold text-sm tracking-wide">NGT.ACADEMY</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              {variant === "ssm" ? "Internal · SSM" : "Student"}
            </div>
          </div>
        </Link>
      </div>

      <nav className="py-4 flex-1">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/ssm" && item.href !== "/student" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-5 py-2.5 text-[13px] transition relative",
                active
                  ? "text-ngt-yellow bg-white/[0.04]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-ngt-yellow" />}
              <span className="opacity-90">{item.icon}</span>
              <span className="font-medium uppercase tracking-wider text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {variant === "ssm" ? (
        <div className="m-4 p-3 rounded-md bg-white/[0.04] border border-white/10 text-[11px] text-white/70">
          <div className="font-semibold text-white mb-1">Prototype</div>
          Native LMS dashboards · placeholder data only.
        </div>
      ) : (
        <div className="m-4 p-3 rounded-md bg-ngt-yellow/10 border border-ngt-yellow/30 text-[11px] text-white/80">
          <div className="font-semibold text-ngt-yellow mb-1">Earn up to $500</div>
          for every student you refer.{" "}
          <span className="underline text-ngt-yellow">Refer a friend</span>
        </div>
      )}

      <div className="mt-2 mb-4 px-5 flex flex-col gap-2">
        <Link
          href={variant === "ssm" ? "/student" : "/ssm"}
          className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-white/40 hover:text-white border border-white/10 rounded px-2 py-2"
        >
          <PlusCircle size={12} /> Switch to {variant === "ssm" ? "Student" : "SSM"} view
        </Link>
      </div>
    </aside>
  );
}
