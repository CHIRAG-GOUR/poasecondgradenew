/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'baloo': ['"Baloo 2"', 'cursive'],
      },
      colors: {
        sky: {
          light: '#E0F7FF',
          DEFAULT: '#7EC8E3',
          dark: '#0070A8',
        },
        grass: {
          light: '#C8F5A0',
          DEFAULT: '#5DBB41',
          dark: '#2D7A1D',
        },
        sunshine: '#FFD93D',
        candy: {
          pink: '#FF6B9D',
          purple: '#C77DFF',
          orange: '#FF8C42',
          mint: '#4ECDC4',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
