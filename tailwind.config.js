import {heroui} from "@heroui/theme"

// Paleta de marca "Flymingo Weddings" — editorial de lujo, playa mexicana
const clay = {
  50: "#FBF0E9",
  100: "#F5DDD0",
  200: "#EBBBA1",
  300: "#DE9873",
  400: "#CE7B52",
  500: "#B5602F",
  600: "#954E27",
  700: "#763D1F",
  800: "#562C17",
  900: "#371C0F",
}

const sand = {
  50: "#FCF9EF",
  100: "#F7EFD3",
  200: "#EFDFA7",
  300: "#E5CC78",
  400: "#D9B84E",
  500: "#C9A227",
  600: "#A98420",
  700: "#85661A",
  800: "#614A13",
  900: "#3D2E0C",
}

const ink = "#241F1B"
const ivory = "#FBF6EF"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: { DEFAULT: ivory },
            foreground: { DEFAULT: ink },
            content1: { DEFAULT: "#FFFFFF", foreground: ink },
            divider: { DEFAULT: "rgba(36, 31, 27, 0.12)" },
            primary: { ...clay, DEFAULT: clay[500], foreground: "#FFFFFF" },
            secondary: { ...sand, DEFAULT: sand[500], foreground: ink },
          },
        },
        dark: {
          colors: {
            background: { DEFAULT: "#1B1613" },
            foreground: { DEFAULT: ivory },
            content1: { DEFAULT: "#241F1B", foreground: ivory },
            divider: { DEFAULT: "rgba(251, 246, 239, 0.15)" },
            primary: { ...clay, DEFAULT: clay[400], foreground: "#1B1613" },
            secondary: { ...sand, DEFAULT: sand[400], foreground: "#1B1613" },
          },
        },
      },
    }),
  ],
}

module.exports = config;