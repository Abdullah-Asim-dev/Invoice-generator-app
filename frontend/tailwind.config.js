/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // Electric Violet
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Electric Indigo
          600: '#4f46e5',
          700: '#4338ca',
        },
        slate: {
          850: '#131b2e',
          925: '#0b1120',
          950: '#080d1a',
        }
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'subtle': '0 1px 3px 0 rgba(24, 24, 27, 0.03), 0 1px 2px -1px rgba(24, 24, 27, 0.02)',
        'card': '0 0 0 1px rgba(24, 24, 27, 0.05), 0 1px 3px 0 rgba(24, 24, 27, 0.03)',
        'card-hover': '0 0 0 1px rgba(24, 24, 27, 0.08), 0 8px 24px -4px rgba(24, 24, 27, 0.06)',
        'paper': '0 0 0 1px rgba(24, 24, 27, 0.06), 0 12px 32px -8px rgba(24, 24, 27, 0.08), 0 4px 12px -2px rgba(24, 24, 27, 0.03)',
        'glow-violet': '0 0 20px -3px rgba(124, 58, 237, 0.25)',
      }
    },
  },
  plugins: [],
}
