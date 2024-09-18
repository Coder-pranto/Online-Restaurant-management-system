/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    fontFamily: {
      poppins: ["Poppins"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#FFA901",
      },
    },
  },
  plugins: [],
};
