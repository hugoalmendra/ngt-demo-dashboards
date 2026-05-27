import clsx from "clsx";
import { Award, CheckCircle2 } from "lucide-react";
import type { CertRecord } from "@/lib/types";
import { ProgressBar } from "./progress-bar";
import { formatDate } from "@/lib/format";

const CERT_COLORS: Record<CertRecord["code"], string> = {
  CCNA: "from-sky-500 to-sky-700",
  FSNA: "from-amber-500 to-amber-700",
  FSNP: "from-emerald-500 to-emerald-700",
  NCSA: "from-violet-500 to-violet-700",
  NetworkPlus: "from-rose-500 to-rose-700",
  SecurityPlus: "from-orange-500 to-orange-700",
};

export function CertBadge({ cert }: { cert: CertRecord }) {
  return (
    <div className="bg-white border border-ngt-line rounded-lg p-3 flex flex-col gap-2 shadow-card">
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "w-10 h-10 rounded-md bg-gradient-to-br grid place-items-center text-white shrink-0",
            CERT_COLORS[cert.code]
          )}
        >
          {cert.earned ? <CheckCircle2 size={20} /> : <Award size={20} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-sm leading-tight truncate">{cert.label}</div>
            {cert.earned && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Earned
              </span>
            )}
          </div>
          <div className="text-[11px] text-ngt-muted mt-0.5">
            {cert.earned
              ? <>Issued {formatDate(cert.issuedAt)}</>
              : <>{cert.progressPct === 0 ? "Not started" : `${cert.progressPct}% complete`}</>}
          </div>
        </div>
      </div>
      <ProgressBar value={cert.progressPct} size="sm" variant={cert.earned ? "green" : "yellow"} />
    </div>
  );
}
