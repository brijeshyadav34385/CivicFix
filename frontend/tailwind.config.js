/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#16233F",
          light: "#233254",
        },
        signal: "#FF6B35",
        paper: "#F6F5F1",
        ink: "#2B2F38",
        resolved: "#2F9E68",
        progress: "#E8A33D",
        pending: "#D64550",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
