/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: "#5D0B86",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-md": {
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
        },
        ".text-shadow-lg": {
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow-xl": {
          textShadow: "3px 3px 6px rgba(0, 0, 0, 0.7)",
        },
      });
    },
  ],
};
