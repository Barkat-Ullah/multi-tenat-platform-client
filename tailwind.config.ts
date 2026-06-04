import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        inter: ["var(--font-inter)"],
        roboto: ["Roboto", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        sans3: ["Source Sans 3", "sans-serif"],
        robotomono: ["Roboto Mono", "monospace"]
      },
      colors: {
        black: "#000",
        title: "#121212",

        // Match Ant Design tokens
        primary: {
          DEFAULT: "#00B2D8", // Blue
          dark: "#0092B3",
          light: "#33C7E2",
        },
        secondary: {
          DEFAULT: "#2E2E2E", // Blue
          dark: "#2E2E2E",
          light: "#2E2E2E",
        },
        success: {
          DEFAULT: "#3ECF8E", // Green
          dark: "#158562",
          light: "#44C998",
        },
        warning: {
          DEFAULT: "#FAAD14", // Orange/Yellow
          dark: "#D48806",
          light: "#FFD666",
        },
        danger: {
          DEFAULT: "#FF6B6B", // Red
          dark: "#D9363E",
          light: "#FF7875",
        },

        tomato: "#FF6B6B",
        "gray-light": "#f1f1f1",
        "light-green": "#3ECF8E",
        "light-orange": "#FFF4E9",

        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        xs: "540px",
      },
      container: {
        padding: "20px",
        center: true,
        screens: {
          DEFAULT: "1600px",
        },
      },
      animation: {
        'spin-reverse': 'spin 3s linear infinite reverse',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui() as any],
} satisfies Config;

