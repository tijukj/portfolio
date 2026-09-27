import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          bg: "#F5F4F0",
          text: "#111111",
          hairline: "#111111",
          muted: "#555555",
          subtle: "#888888",
          card: "#EFECE6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        swiss: "0.15em",
        tightest: "-0.04em",
        tighter: "-0.02em",
      },
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [],
};
export default config;
