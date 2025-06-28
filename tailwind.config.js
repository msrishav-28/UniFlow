/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        'sm': '428px'
      },
      aspectRatio: {
        '9/16': '9 / 16'
      },
      animation: {
        'heart': 'heartBeat 0.8s ease-in-out',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};