/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{html,js,jsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedc',
          400: '#609dc9',
          500: '#3c81b2',
          600: '#2c6794',
          700: '#255378',
          800: '#224664',
          900: '#0f2942',
          950: '#0a1a2b',
        },
        accent: {
          50: '#fffbf0',
          100: '#fef5d6',
          200: '#fde7ad',
          300: '#fbd47a',
          400: '#f8bc46',
          500: '#c59b27',
          600: '#b0841d',
          700: '#8c6218',
        }
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'button': '6px',
      }
    },
  },
  plugins: [],
}
