import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colors are variables so IAU students get blue (see globals.css).
        // "yellow" names the NGT default; it means "the brand accent".
        ngt: {
          yellow: "rgb(var(--brand) / <alpha-value>)",
          yellowDark: "rgb(var(--brand-dark) / <alpha-value>)",
          onBrand: "rgb(var(--on-brand) / <alpha-value>)",
          ink: "#1B1F23",
          panel: "#252A30",
          slate: "#2F353C",
          line: "#E5E7EB",
          bg: "#F4F5F7",
          text: "#1F2937",
          muted: "#6B7280",
          good: "#10B981",
          warn: "#F59E0B",
          bad: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
