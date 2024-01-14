import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        "100dvh": "100dvh",
      },
      minHeight: {
        "100dvh": "100dvh",
      },
      screens: {
        xs: "475px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradiant-white-b":
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 1) 50%,rgba(255, 255, 255, 1) 100%)",
      },
      animation: {
        "bounce-once": "bounce-once 1s ease-out",
        "slide-in": "slide-in 0.5s ease-out;",
      },
      colors: {
        "sky-250": "#A9E5FF",
      },
    },
  },
  plugins: [],
};
export default config;
