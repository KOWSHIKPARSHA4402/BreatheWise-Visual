import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        freshWhite: "#F4F8F6",
        mistGreen: {
          DEFAULT: "#DCECE8",
          50: "#F7FAF9",
          100: "#EEF6F3",
          200: "#DCECE8",
          300: "#C4DFD8",
          400: "#A9D5C8",
        },
        seafoam: {
          DEFAULT: "#A9D5C8",
          light: "#C5E4DB",
          dark: "#79BFAE",
        },
        oceanTeal: {
          DEFAULT: "#6BAEAA",
          light: "#8BC4C0",
          dark: "#4B9490",
        },
        deepTeal: {
          DEFAULT: "#234B55",
          light: "#2E5F6C",
          dark: "#1A373E",
          900: "#13272C",
        },
        softAmber: {
          DEFAULT: "#E9B978",
          light: "#F2CE9D",
          dark: "#D69F54",
        },
        mutedCoral: {
          DEFAULT: "#D98E83",
          light: "#E6ABA1",
          dark: "#C67165",
        },
        softSlate: {
          DEFAULT: "#687D83",
          light: "#86999F",
          dark: "#4E5F64",
        },
        aqi: {
          good: "#4A9E86",
          satisfactory: "#6BAEAA",
          moderate: "#E9B978",
          poor: "#E0937A",
          verypoor: "#D98E83",
          severe: "#B85450",
        },
        brand: {
          50: "#F4F8F6",
          100: "#DCECE8",
          200: "#A9D5C8",
          300: "#8BC4C0",
          400: "#6BAEAA",
          500: "#234B55",
          600: "#1E414A",
          700: "#17333B",
          800: "#12272C",
          900: "#0D1B1E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
