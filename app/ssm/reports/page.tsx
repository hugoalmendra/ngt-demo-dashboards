export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1">
          Internal · SSM
        </div>
        <h1 className="text-2xl font-black">Reports</h1>
        <p className="text-sm text-ngt-muted mt-1">
          Placeholder for future scheduled reports / exports (CSV, weekly digest, etc.).
        </p>
      </div>
      <div className="bg-white border border-ngt-line rounded-lg p-10 text-center shadow-card">
        <div className="text-ngt-muted text-sm">No reports configured yet.</div>
      </div>
    </div>
  );
}
