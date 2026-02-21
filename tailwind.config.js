/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#F4FAFB",
        deep: "#0F4C75",
        stability: "#1B6B7A",
        glow: "#9ADBD9",
        amber: "#F4B860",
      },
    },
  },
  plugins: [],
}