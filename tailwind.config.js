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
        'shimmer': 'shimmer 2s infinite',
        'confetti': 'confetti 0.6s ease-out forwards',
        'liquid-pull': 'liquidPull 0.3s ease-out',
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        accent: '#14b8a6',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1, #ec4899)',
        'gradient-accent': 'linear-gradient(135deg, #14b8a6, #6366f1)',
        'gradient-overlay': 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.6) 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-secondary': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-accent': '0 0 20px rgba(20, 184, 166, 0.5)',
      }
    },
  },
  plugins: [],
};