import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "bounce-once": "bounce-once 1s ease-out",
        // "slide-out": "slide-out 0.5s ease-out forwards",
        "slide-in": "slide-in 0.5s ease-out forwards;",
      },
      colors: {
        "sky-250": "#A9E5FF",
      },
    },
  },
  plugins: [],
};
export default config;
