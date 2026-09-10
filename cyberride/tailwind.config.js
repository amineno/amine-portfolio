/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#0A0A0A',
        'charcoal': '#141414',
        'gunmetal': '#1F1F1F',
        'crimson-red': '#E10600',
        'blood-red': '#8B0000',
        'neon-red': '#FF1A1A',
        'electric-white': '#F5F5F5',
        'parchment': '#E8E4DC',
        'bronze': '#B87333',
        'amber-gold': '#FFBF00',
        'grid-line': '#2A2A2A',
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        sub: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
