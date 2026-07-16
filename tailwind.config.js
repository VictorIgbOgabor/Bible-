/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          bg: "#0A0F1E",
          card: "#131B2E",
          hover: "#1A2438",
          border: "#1E2740",
        },
        brand: {
          orange: "#FF8A3D",
          purple: "#9B6BFF",
        },
        ink: {
          DEFAULT: "#F4F5F7",
          muted: "#8A93A6",
          faint: "#5C6478",
        },
      },
    },
  },
  plugins: [],
};
