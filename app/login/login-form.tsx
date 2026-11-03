"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { GraduationCap } from "lucide-react";
import { setPreviewBrand, type Brand } from "@/lib/brand";

type Mode = "signin" | "signup";

/**
 * Generic login / sign-up. We don't know who the student is until they sign in,
 * so this page carries no NGT or IAU colors or logos: neutral palette only.
 * The student's brand applies right after sign-in, based on their IAU tag.
 */
export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [previewAs, setPreviewAs] = useState<Brand>("ngt");
  const signup = mode === "signup";

  const enter = () => {
    setPreviewBrand(previewAs);
    router.push("/student");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white grid place-items-center">
            <GraduationCap size={24} />
          </div>
          <div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mt-3">Student Portal</div>
          <h1 className="text-2xl font-black mt-1">{signup ? "Create your account" : "Welcome back"}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {signup ? "Start your training in a few steps." : "Sign in to continue your training."}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div role="tablist" aria-label="Sign in or sign up" className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 mb-5">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={clsx(
                  "h-9 rounded-md text-[13px] font-semibold transition",
                  mode === m ? "bg-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              enter();
            }}
          >
            {signup && <Field label="Full name" autoComplete="name" />}
            <Field label="Email" type="email" autoComplete="email" />
            <Field label="Password" type="password" autoComplete={signup ? "new-password" : "current-password"} />
            {!signup && (
              <div className="text-right">
                <button type="button" className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}
            <button type="submit" className="w-full h-11 rounded-md bg-slate-900 hover:bg-slate-700 text-white text-sm font-bold transition">
              {signup ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4 text-[12px] text-slate-400">
            <span className="flex-1 h-px bg-slate-200" /> or <span className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={enter}
            className="w-full h-11 rounded-md border border-slate-300 hover:bg-slate-50 text-sm font-semibold transition"
          >
            Continue with Google
          </button>

          {signup && (
            <p className="text-[12px] text-slate-500 text-center mt-4">
              By creating an account you agree to the Terms and Privacy Policy.
            </p>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-3 text-[12px] text-slate-500">
          <div className="font-semibold text-slate-700">Prototype only: no real login</div>
          <p className="mt-0.5">After sign-in, the student&apos;s account decides the colors. Enter as:</p>
          <div className="mt-2 flex gap-4">
            {(["ngt", "iau"] as Brand[]).map((b) => (
              <label key={b} className="inline-flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="preview-as"
                  checked={previewAs === b}
                  onChange={() => setPreviewAs(b)}
                  className="accent-slate-900"
                />
                {b === "ngt" ? "NGT student" : "IAU student"}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] uppercase tracking-widest text-slate-400">Powered by NGT.Academy</div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", autoComplete }: { label: string; type?: string; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold mb-1">{label}</span>
      <input
        type={type}
        autoComplete={autoComplete}
        className="w-full h-11 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </label>
  );
}
