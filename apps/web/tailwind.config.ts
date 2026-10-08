import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FBF5EA",
        surface: "#FFFFFF",
        "surface-alt": "#F4EADB",
        ink: "#2B1A12",
        primary: "#C98A2B",
        accent: "#8A5A14",
        deep: "#6B2E1F",
        calm: "#2F6F6B",
        border: "#E6D9C3",
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        display: ['"Times New Roman"', 'Times', 'serif'],
      },
      fontSize: {
        'xs': '1.125rem',
        'sm': '1.25rem',
        'base': '1.5rem',
        'lg': '1.875rem',
        'xl': '2.25rem',
        '2xl': '3rem',
        '3xl': '3.75rem',
        '4xl': '4.5rem',
        '5xl': '6rem',
        '6xl': '7rem',
        '7xl': '8rem',
        '8xl': '10rem',
      },
    },
  },
  plugins: [],
};
export default config;
