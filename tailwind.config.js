/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          dark: '#0a050c',
          felt: '#064e3b',
          gold: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}