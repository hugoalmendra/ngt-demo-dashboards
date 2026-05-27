export function DataRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-3 py-2 border-b border-ngt-line last:border-b-0">
      <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold w-[40%]">
        {label}
      </div>
      <div className="text-sm text-ngt-text font-medium flex-1 min-w-0">{value || "—"}</div>
    </div>
  );
}
