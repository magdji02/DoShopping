/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: '#1E3A8A',
        gold: '#FBBF24',
        lightgray: '#F5F6FA',
        pure: '#FFFFFF',
        softblack: '#222222',
        mint: '#00C896',
        softred: '#E53E3E'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        xl: '16px'
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.08)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 500ms ease-in-out both',
        shimmer: 'shimmer 1.5s infinite linear'
      }
    },
  },
  plugins: [],
}
