/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        chirp: ["Chirp", "verdana", "sans-serif"],
        chirpbold: ["Chirp-Bold", "verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
