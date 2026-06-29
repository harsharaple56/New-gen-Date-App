/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6C5CE7',
          50: '#F3F1FD',
          100: '#E9E6FB',
          500: '#6C5CE7',
          600: '#5A4BD4',
          700: '#4A3CB8',
        },
        ink: {
          DEFAULT: '#111114',
          soft: '#6E6E78',
          muted: '#9A9AA2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F4F5F7',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(17,17,20,0.06), 0 1px 2px rgba(17,17,20,0.04)',
      },
    },
  },
  plugins: [],
};
