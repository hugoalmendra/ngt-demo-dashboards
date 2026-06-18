"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, CreditCard, UserPlus, X } from "lucide-react";

export interface NewUser {
  firstName: string;
  lastName: string;
  iauStudent: boolean;
  iauTerm: string;
  iauProgramOfStudy: string;
  iauProgramType: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  streetAddress: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  role: string;
  tshirtSize: string;
  foundUs: string;
  referralCode: string;
}

interface Props {
  onClose: () => void;
  onCreate?: (user: NewUser) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => String(CURRENT_YEAR - i));

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Spain", "Mexico", "Brazil", "India", "Philippines", "Other",
];

const ROLES = ["Student", "Instructor", "SSM", "Admin"];

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "N/A"];

const FOUND_US_OPTIONS = [
  "Google Search",
  "Social Media",
  "Friend / Referral",
  "YouTube",
  "Podcast",
  "Event / Webinar",
  "Other",
];

// IAU school terms with fixed start/end dates. Dates are display-only and
// driven by the selected term (TBD = not yet announced).
interface IauTerm {
  name: string;
  startDate: string;
  endDate: string;
}

const IAU_TERMS: IauTerm[] = [
  { name: "Spring Session 1 2026", startDate: "1/5/26", endDate: "6/5/26" },
  { name: "Spring Session 2 2026", startDate: "3/2/26", endDate: "9/2/26" },
  { name: "Summer Session 1 2026", startDate: "5/4/26", endDate: "11/4/26" },
  { name: "Summer Session 2 2026", startDate: "6/29/26", endDate: "12/20/26" },
  { name: "Fall Session 1 2027", startDate: "8/31/26", endDate: "2/28/27" },
  { name: "Fall Session 2 2027", startDate: "10/26/26", endDate: "4/25/27" },
  { name: "Spring Session 1 2027", startDate: "1/4/27", endDate: "6/27/27" },
  { name: "Spring Session 2 2027", startDate: "3/1/27", endDate: "8/22/27" },
  { name: "Summer Session 1 2027", startDate: "5/3/27", endDate: "TBD" },
  { name: "Summer Session 2 2027", startDate: "6/28/27", endDate: "TBD" },
];

const IAU_PROGRAMS_OF_STUDY = [
  "Certificate Cybersecurity Accelerator (CCA)",
  "Certificate Full Stack Network Engineer (CFSNE)",
];

const IAU_PROGRAM_TYPES = ["Degree", "Certificate"];

export function AddUserModal({ onClose, onCreate }: Props) {
  const [form, setForm] = useState<NewUser>({
    firstName: "",
    lastName: "",
    iauStudent: false,
    iauTerm: "",
    iauProgramOfStudy: "",
    iauProgramType: "",
    birthMonth: MONTHS[0],
    birthDay: DAYS[0],
    birthYear: String(CURRENT_YEAR),
    streetAddress: "",
    country: "United States",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    role: "Student",
    tshirtSize: "M",
    foundUs: "",
    referralCode: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof NewUser>(key: K, value: NewUser[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const selectedTerm = useMemo(
    () => IAU_TERMS.find((t) => t.name === form.iauTerm) ?? null,
    [form.iauTerm]
  );

  const isValid = useMemo(
    () =>
      form.firstName.trim() !== "" &&
      form.lastName.trim() !== "" &&
      form.phoneNumber.trim() !== "" &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.role.trim() !== "" &&
      form.foundUs.trim() !== "" &&
      (!form.iauStudent ||
        (form.iauTerm.trim() !== "" &&
          form.iauProgramOfStudy.trim() !== "" &&
          form.iauProgramType.trim() !== "")),
    [form]
  );

  const handleSave = () => {
    if (!isValid || submitted) return;
    setSubmitted(true);
    onCreate?.(form);
    setTimeout(onClose, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 py-5 border-b border-ngt-line flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-ngt-yellow/15 text-ngt-yellowDark grid place-items-center shrink-0">
              <UserPlus size={18} />
            </div>
            <h2 className="text-xl font-bold text-ngt-text leading-tight">Add User</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ngt-muted hover:text-ngt-text shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" required>
              <TextInput
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
              />
            </Field>
            <Field label="Last Name" required>
              <TextInput
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
              />
            </Field>
          </div>

          {/* Special status */}
          <Field label="Special Status">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.iauStudent}
                onChange={(e) => set("iauStudent", e.target.checked)}
                className="w-4 h-4 rounded border-ngt-line text-ngt-yellow focus:ring-ngt-yellow/40 accent-ngt-yellow"
              />
              <span className="text-sm text-ngt-text">IAU Student</span>
            </label>
          </Field>

          {/* IAU-only fields */}
          {form.iauStudent && (
            <div className="rounded-md border border-ngt-yellow/40 bg-ngt-yellow/5 px-4 py-4 space-y-4">
              <div className="text-[11px] uppercase tracking-widest text-ngt-yellowDark font-bold">
                IAU Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Term" required>
                  <Select
                    value={form.iauTerm}
                    onChange={(v) => set("iauTerm", v)}
                    options={IAU_TERMS.map((t) => t.name)}
                    placeholder="Select a term"
                  />
                </Field>
                <Field label="Term Dates">
                  <div className="h-10 px-3 rounded-md border border-ngt-line bg-ngt-bg/60 text-sm text-ngt-text flex items-center">
                    {selectedTerm ? (
                      <span className="tabular-nums">
                        {selectedTerm.startDate} &ndash; {selectedTerm.endDate}
                      </span>
                    ) : (
                      <span className="text-ngt-muted">Select a term to see dates</span>
                    )}
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Program of Study" required>
                  <Select
                    value={form.iauProgramOfStudy}
                    onChange={(v) => set("iauProgramOfStudy", v)}
                    options={IAU_PROGRAMS_OF_STUDY}
                    placeholder="Select a program"
                  />
                </Field>
                <Field label="IAU Program Type" required>
                  <Select
                    value={form.iauProgramType}
                    onChange={(v) => set("iauProgramType", v)}
                    options={IAU_PROGRAM_TYPES}
                    placeholder="Select a type"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Birth date */}
          <Field label="Birth Date">
            <div className="grid grid-cols-3 gap-3">
              <Select
                value={form.birthMonth}
                onChange={(v) => set("birthMonth", v)}
                options={MONTHS}
              />
              <Select
                value={form.birthDay}
                onChange={(v) => set("birthDay", v)}
                options={DAYS}
              />
              <Select
                value={form.birthYear}
                onChange={(v) => set("birthYear", v)}
                options={YEARS}
              />
            </div>
          </Field>

          {/* Street address */}
          <Field label="Street Address">
            <TextInput
              value={form.streetAddress}
              onChange={(v) => set("streetAddress", v)}
            />
          </Field>

          {/* Country / City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country">
              <Select
                value={form.country}
                onChange={(v) => set("country", v)}
                options={COUNTRIES}
              />
            </Field>
            <Field label="City">
              <TextInput value={form.city} onChange={(v) => set("city", v)} />
            </Field>
          </div>

          {/* State / Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="State">
              <TextInput value={form.state} onChange={(v) => set("state", v)} />
            </Field>
            <Field label="Zip Code">
              <TextInput
                value={form.zipCode}
                onChange={(v) => set("zipCode", v)}
              />
            </Field>
          </div>

          {/* Phone / Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone Number" required>
              <TextInput
                type="tel"
                value={form.phoneNumber}
                onChange={(v) => set("phoneNumber", v)}
              />
            </Field>
            <Field label="Email" required>
              <TextInput
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
              />
            </Field>
          </div>

          {/* Role / T-shirt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="User Role" required>
              <Select
                value={form.role}
                onChange={(v) => set("role", v)}
                options={ROLES}
              />
            </Field>
            <Field label="T-Shirt Size">
              <Select
                value={form.tshirtSize}
                onChange={(v) => set("tshirtSize", v)}
                options={TSHIRT_SIZES}
              />
            </Field>
          </div>

          {/* Found us / Referral */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="How Did You Find Us?" required>
              <Select
                value={form.foundUs}
                onChange={(v) => set("foundUs", v)}
                options={FOUND_US_OPTIONS}
                placeholder="Select an option"
              />
            </Field>
            <Field label="Referral Code">
              <TextInput
                value={form.referralCode}
                onChange={(v) => set("referralCode", v)}
              />
            </Field>
          </div>

          {/* Credit card */}
          <div className="pt-4 border-t border-ngt-line flex items-center gap-4">
            <span className="text-sm text-ngt-text font-medium">Credit card:</span>
            <span className="text-sm text-ngt-muted">You don't have a credit card yet</span>
            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest text-ngt-yellowDark hover:text-ngt-yellow"
            >
              <CreditCard size={13} /> Add Credit Card
            </button>
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-ngt-line bg-ngt-bg/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-9 px-5 rounded-md text-[11px] font-bold uppercase tracking-widest text-ngt-muted hover:text-ngt-text border border-ngt-line hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || submitted}
            className={clsx(
              "h-9 px-6 rounded-md text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 transition",
              submitted
                ? "bg-emerald-500 text-white cursor-default"
                : !isValid
                ? "bg-ngt-line text-ngt-muted cursor-not-allowed"
                : "bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
            )}
          >
            {submitted ? (
              <>
                <Check size={12} /> User added
              </>
            ) : (
              <>Save</>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">
        {label}
        {required && (
          <span className="ml-1 normal-case tracking-normal text-[10px] text-ngt-muted/80 font-medium">
            (Mandatory Field)
          </span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-md border border-ngt-line text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
    />
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "w-full h-10 px-3 rounded-md border border-ngt-line text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40",
        value === "" && "text-ngt-muted"
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
