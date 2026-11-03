"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUp, Clock, MessageSquarePlus, Mic, RotateCcw, Sparkles, X } from "lucide-react";
import {
  CYPHER_DAILY_LIMIT,
  CYPHER_PROMPTS,
  type CypherMessage,
  cypherReply,
  cypherReset,
  todayKey,
} from "@/lib/cypher";

const STORAGE_KEY = "ngt-demo-cypher-v1";
const SYNC_EVENT = "ngt-cypher-sync";

interface CypherState {
  day: string;
  used: number;
  messages: CypherMessage[];
}

const fresh = (): CypherState => ({ day: todayKey(), used: 0, messages: [] });

function load(): CypherState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh();
    const s = JSON.parse(raw) as CypherState;
    // New day: credits reset. The conversation is kept.
    return s.day === todayKey() ? s : { ...s, day: todayKey(), used: 0 };
  } catch {
    return fresh();
  }
}

function save(s: CypherState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage blocked: state still works for this page view */
  }
  window.dispatchEvent(new Event(SYNC_EVENT));
}

/** Daily credits + conversation, shared by every Cypher surface on the page. */
function useCypher() {
  const [state, setState] = useState<CypherState>(fresh);

  useEffect(() => {
    const sync = () => setState(load());
    sync();
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    // Catch the midnight reset while the page stays open.
    const t = setInterval(sync, 60_000);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
      clearInterval(t);
    };
  }, []);

  const update = useCallback((fn: (s: CypherState) => CypherState) => save(fn(load())), []);
  return { ...state, left: Math.max(0, CYPHER_DAILY_LIMIT - state.used), update };
}

export function CypherLogo({ size = 20, className }: { size?: number; className?: string }) {
  return <Sparkles size={size} className={className} />;
}

/** Cypher chat with a daily limit of CYPHER_DAILY_LIMIT messages per student. */
export function CypherChat({ onClose, compact }: { onClose?: () => void; compact?: boolean }) {
  const { messages, left, update } = useCypher();
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [reset, setReset] = useState<{ in: string; at: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const outOfCredits = left === 0;

  useEffect(() => {
    setReset(cypherReset());
    const t = setInterval(() => setReset(cypherReset()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing || outOfCredits) return;
    const id = `${Date.now()}`;
    update((s) => ({
      ...s,
      used: s.used + 1,
      messages: [...s.messages, { id: `u${id}`, role: "user", text: q }],
    }));
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      update((s) => ({ ...s, messages: [...s.messages, { id: `c${id}`, role: "cypher", text: cypherReply(q) }] }));
      setTyping(false);
    }, 900);
  };

  return (
    <div className="bg-white text-ngt-text h-full flex flex-col min-h-0">
      {onClose && (
        <header className="h-16 shrink-0 px-5 flex items-center justify-between border-b border-ngt-line">
          <div className="flex items-center gap-2.5">
            <CypherLogo size={24} />
            <span className="text-lg font-black tracking-wider">CYPHER</span>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn label="New chat" onClick={() => update((s) => ({ ...s, messages: [] }))}>
              <MessageSquarePlus size={18} />
            </IconBtn>
            <IconBtn label="Close Cypher" onClick={onClose}>
              <X size={18} />
            </IconBtn>
          </div>
        </header>
      )}

      <div ref={scroller} className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-ngt-yellow grid place-items-center">
              <CypherLogo size={34} className="text-ngt-onBrand" />
            </div>
            <div className="text-2xl font-bold mt-4">Hi, I&apos;m Cypher</div>
            <p className="text-[14px] text-ngt-muted mt-1">and I&apos;m here to help you level up your career!</p>
            <div className={clsx("grid gap-2 mt-6", compact ? "grid-cols-1" : "grid-cols-2")}>
              {CYPHER_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={outOfCredits}
                  onClick={() => send(p)}
                  className="border border-ngt-line rounded-md px-3 py-4 text-[13px] leading-snug hover:border-ngt-yellow hover:bg-ngt-yellow/5 disabled:opacity-50 disabled:hover:border-ngt-line disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start gap-2")}>
                {m.role === "cypher" && (
                  <span className="w-7 h-7 shrink-0 rounded-full bg-ngt-yellow grid place-items-center">
                    <CypherLogo size={14} className="text-ngt-onBrand" />
                  </span>
                )}
                <div
                  className={clsx(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
                    m.role === "user" ? "bg-ngt-ink text-white rounded-br-sm" : "bg-ngt-bg rounded-bl-sm"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2" aria-label="Cypher is typing">
                <span className="w-7 h-7 rounded-full bg-ngt-yellow grid place-items-center">
                  <CypherLogo size={14} className="text-ngt-onBrand" />
                </span>
                <div className="bg-ngt-bg rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-ngt-muted animate-bounce"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 border-t border-ngt-line">
        {outOfCredits ? (
          <div role="status" className="rounded-lg bg-ngt-bg border border-ngt-line p-4 text-center">
            <Clock size={20} className="mx-auto text-ngt-muted" />
            <div className="font-bold text-[14px] mt-2">You&apos;ve used today&apos;s {CYPHER_DAILY_LIMIT} messages</div>
            <p className="text-[13px] text-ngt-muted mt-1">
              {reset ? (
                <>
                  New messages at <span className="font-semibold text-ngt-text">{reset.at}</span> · in {reset.in}.
                </>
              ) : (
                "New messages tomorrow."
              )}{" "}
              You can still read this conversation.
            </p>
            <p className="text-[12px] text-ngt-muted mt-2">
              Need help now? Reach out to your{" "}
              <span className="font-semibold text-ngt-text">Student Success Manager</span>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="h-12 rounded-md border border-ngt-line pl-3 pr-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-ngt-yellow/40"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask me anything"
              aria-label="Message Cypher"
              className="flex-1 min-w-0 text-[14px] bg-transparent focus:outline-none"
            />
            {draft.trim() ? (
              <button
                type="submit"
                disabled={typing}
                aria-label="Send"
                className="w-9 h-9 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-ngt-onBrand grid place-items-center disabled:opacity-50"
              >
                <ArrowUp size={16} />
              </button>
            ) : (
              <span className="w-9 h-9 grid place-items-center text-ngt-muted">
                <Mic size={16} />
              </span>
            )}
          </form>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2 text-[12px] text-ngt-muted">
          <span className="inline-flex items-center gap-2" aria-label={`${left} of ${CYPHER_DAILY_LIMIT} messages left today`}>
            <span className="flex gap-1" aria-hidden>
              {Array.from({ length: CYPHER_DAILY_LIMIT }, (_, i) => (
                <span
                  key={i}
                  className={clsx("w-2 h-2 rounded-full", i < left ? "bg-ngt-yellow" : "bg-ngt-line")}
                />
              ))}
            </span>
            <span className={clsx(left === 1 && "text-amber-700 font-semibold")}>
              {left} of {CYPHER_DAILY_LIMIT} messages left today
            </span>
          </span>
          {/* Prototype only: lets reviewers replay the limit. */}
          <button
            type="button"
            onClick={() => update((s) => ({ ...s, used: 0 }))}
            className="inline-flex items-center gap-1 text-[11px] hover:text-ngt-text"
            title="Prototype only"
          >
            <RotateCcw size={11} /> Demo reset
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-9 h-9 grid place-items-center rounded-md text-ngt-muted hover:text-ngt-text hover:bg-ngt-bg"
    >
      {children}
    </button>
  );
}

/** Right-side Cypher panel (full screen on phones), like production. */
export function CypherDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label="Close Cypher" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cypher"
        className="absolute right-0 top-0 h-full w-full md:w-[480px] shadow-2xl"
      >
        <CypherChat onClose={onClose} />
      </div>
    </div>
  );
}
