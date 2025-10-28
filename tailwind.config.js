/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f6fb',
          100: '#dbe7f6',
          200: '#c4d8f0',
          300: '#9bbde5',
          400: '#6d9ed8',
          500: '#417fc8',
          600: '#2d66ad',
          700: '#224f86',
          800: '#1d406b',
          900: '#183456'
        },
        accent: '#f4b942'
      }
    }
  },
  plugins: []
};
