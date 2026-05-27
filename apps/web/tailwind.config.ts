import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f6f6f6",
        surface: "#ffffff",
        text: "#303030",
        muted: "#5e5e5e",
        subtle: "#a9a9a9",
        border: "#dadada",
        divider: "#f0f0f0",
        brand: "#ff5623",
        success: "#4bc26d",
        danger: "#770d0d",
        dark: "#181818",
      },
      fontFamily: {
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;