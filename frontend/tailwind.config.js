/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf7ed',
          100: '#f9e9cf',
          200: '#f3d09b',
          300: '#edb060',
          400: '#e8913a',
          500: '#d4711e',
          600: '#b85718',
          700: '#963f17',
          800: '#7a3219',
          900: '#652b18',
        },
        saffron: '#FF6B00',
        turmeric: '#E8A000',
        ink: '#1a0f00',
        cream: '#fdf7ed',
        parchment: '#f5edd6'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif']
      }
    }
  },
  plugins: []
}
