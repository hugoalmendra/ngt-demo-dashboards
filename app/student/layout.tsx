import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ngt-bg">
      <Sidebar variant="student" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar ctaLabel="REPORT SUCCESS" />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
