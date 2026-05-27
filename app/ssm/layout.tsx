import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function SsmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ngt-bg">
      <Sidebar variant="ssm" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar rightSearch ctaLabel="EXPORT REPORT" />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
