import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Brand palette — minimal, deliberate
        ink: {
          DEFAULT: "#0B1324",
          50: "#F7F8FA",
          100: "#EEF0F4",
          200: "#D9DDE5",
          300: "#A6ADBE",
          400: "#5B6478",
          500: "#3A4256",
          600: "#222A3D",
          700: "#161D2D",
          800: "#0E1525",
          900: "#0B1324",
        },
        accent: {
          DEFAULT: "#0EA5A0",
          50: "#E6F7F6",
          100: "#C9EFEC",
          400: "#22B5B0",
          500: "#0EA5A0",
          600: "#0A8A86",
          700: "#076F6B",
        },
        gold: {
          DEFAULT: "#C9A94A",
          400: "#D4B963",
          500: "#C9A94A",
          600: "#A88A36",
        },
        rule: "#E3E6EC",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Stripe-style large display sizes
        "display-xl": ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(at 20% 0%, rgba(14,165,160,0.10) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(201,169,74,0.08) 0px, transparent 50%), linear-gradient(to bottom, #ffffff 0%, #F7F8FA 100%)",
        "section-gradient":
          "linear-gradient(180deg, #ffffff 0%, #F7F8FA 100%)",
        "ink-gradient":
          "radial-gradient(at 30% 20%, rgba(14,165,160,0.15) 0px, transparent 50%), radial-gradient(at 70% 60%, rgba(201,169,74,0.10) 0px, transparent 50%), linear-gradient(180deg, #0B1324 0%, #161D2D 100%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,19,36,0.04), 0 4px 12px rgba(11,19,36,0.04)",
        card: "0 1px 3px rgba(11,19,36,0.05), 0 8px 24px rgba(11,19,36,0.06)",
        lift: "0 4px 12px rgba(11,19,36,0.08), 0 16px 48px rgba(11,19,36,0.10)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
