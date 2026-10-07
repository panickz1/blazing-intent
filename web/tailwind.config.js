const scale = (name, alpha = true) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
      step,
      alpha ? `hsl(var(--${name}-${step}) / <alpha-value>)` : `hsl(var(--${name}-${step}))`,
    ])
  );

const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      white: { DEFAULT: token("white-0"), 0: token("white-0"), ...scale("white", false) },
      black: { DEFAULT: token("black-0"), 0: token("black-0"), ...scale("black", false) },
      grey: scale("grey"),
      neutral: scale("grey"),
      primary: {
        DEFAULT: token("primary"),
        foreground: token("primary-foreground"),
        0: token("primary-0"),
        ...scale("primary", false),
      },
      "accent-2": { DEFAULT: token("accent-2"), foreground: token("accent-2-foreground") },
      background: token("background"),
      foreground: token("foreground"),
      fg: { muted: token("fg-muted") },
      secondary: { DEFAULT: token("secondary"), foreground: token("secondary-foreground") },
      muted: { DEFAULT: token("muted"), foreground: token("muted-foreground") },
      accent: { DEFAULT: token("accent"), foreground: token("accent-foreground") },
      destructive: { DEFAULT: token("destructive"), foreground: token("destructive-foreground") },
      success: { DEFAULT: token("success"), foreground: token("success-foreground") },
      warning: "hsl(var(--warning) / <alpha-value>)",
      "on-brand": "hsl(0 0% 100% / <alpha-value>)",
      border: token("border"),
      input: token("input"),
      ring: token("ring"),
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
        full: "var(--radius-full)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, hsl(var(--primary-0)) 0%, hsl(var(--primary-0) / 0.75) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".pt-safe": { paddingTop: "env(safe-area-inset-top, 0px)" },
        ".pr-safe": { paddingRight: "env(safe-area-inset-right, 0px)" },
        ".pb-safe": { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
        ".pl-safe": { paddingLeft: "env(safe-area-inset-left, 0px)" },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
