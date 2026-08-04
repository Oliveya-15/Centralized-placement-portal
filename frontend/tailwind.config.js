/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10233D',
        'ink-light': '#1B3A5C',
        paper: '#F2F1EC',
        card: '#FFFFFF',
        gold: '#C9982E',
        'gold-light': '#E4C878',
        teal: '#1B6F5E',
        'teal-light': '#DCEEE9',
        coral: '#BE4B3A',
        'coral-light': '#F7E2DE',
        slate: '#5B6472',
        line: '#DCD8CC',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'stamp-lines': 'repeating-linear-gradient(0deg, transparent, transparent 3px, currentColor 3px, currentColor 4px)',
      },
    },
  },
  plugins: [],
}
