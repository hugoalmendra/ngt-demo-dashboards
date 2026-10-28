"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChevronRight, Headset, LifeBuoy, Mail, Menu, Sparkles, X } from "lucide-react";
import { findSsm } from "@/lib/mock-data";
import { SsmAvatar, SsmContactBody, useDismiss } from "@/components/assigned-ssm";
import { STUDENT_NAV } from "@/components/sidebar";

/**
 * Student header for phones, modelled on production: hamburger · logo · actions.
 * The assigned SSM sits in the header (always visible) and in the menu drawer;
 * both open the same bottom sheet with Email / Copy.
 */
export function StudentMobileNav({ ssmId, studentName }: { ssmId?: string; studentName: string }) {
  const ssm = findSsm(ssmId);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  useDismiss(menuOpen && !sheetOpen, closeMenu);
  useDismiss(sheetOpen, closeSheet);

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSheetOpen(false);
  }, [pathname]);

  // No page scroll behind an open drawer or sheet.
  useEffect(() => {
    if (!menuOpen && !sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen, sheetOpen]);

  const logo = (
    <img
      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ngt-icon.png`}
      alt="NGT.Academy"
      className="w-10 h-10 object-contain"
    />
  );

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 h-14 bg-ngt-ink text-white grid grid-cols-[1fr_auto_1fr] items-center px-3">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="justify-self-start w-10 h-10 grid place-items-center text-white/60 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <Link href="/student">{logo}</Link>
        <div className="justify-self-end flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={ssm ? `Contact your SSM, ${ssm.name}` : "Get support"}
            aria-haspopup="dialog"
            className="w-10 h-10 grid place-items-center"
          >
            {ssm ? (
              <Headset size={22} className="text-ngt-yellow" />
            ) : (
              <LifeBuoy size={22} className="text-white/60" />
            )}
          </button>
          <span
            aria-label="AI assistant (production feature)"
            className="w-10 h-10 grid place-items-center text-white/60"
          >
            <Sparkles size={22} />
          </span>
        </div>
      </header>

      {/* Menu drawer */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="md:hidden fixed inset-0 z-50 bg-ngt-ink text-white flex flex-col overflow-y-auto"
        >
          <div className="h-14 grid grid-cols-[1fr_auto_1fr] items-center px-3 shrink-0">
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="justify-self-start w-10 h-10 grid place-items-center text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
            {logo}
          </div>

          <nav className="px-5 pt-4">
            {STUDENT_NAV.filter((i) => i.href !== "/student/profile").map((item) => {
              const active =
                pathname === item.href ||
                pathname === `${item.href}/` ||
                (item.href !== "/student" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-5 h-12 font-bold uppercase tracking-wider text-[15px]",
                    active ? "text-white" : "text-white/50 hover:text-white"
                  )}
                >
                  <span className="w-7 grid place-items-center">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-5 mt-4 pt-4 border-t border-white/10 space-y-1">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="w-full flex items-center gap-4 rounded-lg bg-white/[0.05] border border-white/10 px-3 py-3 text-left"
            >
              {ssm ? (
                <SsmAvatar ssm={ssm} />
              ) : (
                <span className="w-9 h-9 rounded-full grid place-items-center bg-white/10 text-white/70">
                  <LifeBuoy size={18} />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-widest text-ngt-yellow font-semibold">
                  {ssm ? "Your SSM · Need help?" : "Need help?"}
                </span>
                <span className="block font-bold text-[15px] truncate">
                  {ssm ? ssm.name : "Contact Academic Support"}
                </span>
              </span>
              <Mail size={18} className="text-white/50" />
            </button>

            <Link
              href="/student/profile"
              className="flex items-center gap-4 h-14 px-3 text-white/50 hover:text-white"
            >
              <span className="w-9 h-9 rounded-full bg-amber-500 text-white grid place-items-center text-xs font-bold">
                {studentName
                  .split(" ")
                  .map((p) => p[0])
                  .filter((c) => /[A-Z]/.test(c))
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="flex-1 font-bold uppercase tracking-wider text-[15px]">{studentName}</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="px-5 py-5 mt-auto">
            <button
              type="button"
              className="w-full h-12 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-black font-bold"
            >
              Report Success
            </button>
          </div>
        </div>
      )}

      {/* SSM bottom sheet */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <button
            type="button"
            aria-label="Close"
            onClick={closeSheet}
            className="absolute inset-0 bg-black/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Your Student Success Manager"
            className="relative bg-white rounded-t-2xl px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ngt-line" />
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
                Your Student Success Manager
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close"
                className="w-8 h-8 -mr-2 grid place-items-center text-ngt-muted hover:text-ngt-text"
              >
                <X size={18} />
              </button>
            </div>
            <SsmContactBody ssmId={ssmId} large />
          </div>
        </div>
      )}
    </>
  );
}
