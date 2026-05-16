/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#07090f',
        primary: '#00d4ff', // cyan
        secondary: '#00ff88', // terminal green
        warning: '#ff4d6d', // threat red
        accent: '#c8d6e5', // text
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
