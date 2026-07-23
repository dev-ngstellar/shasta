/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          navy: '#111827',
          gold: '#D4A24C',
          red: '#E11D48',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Cinzel Decorative', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #111827 0%, #0A0A0A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4A24C 0%, #AA7C11 100%)',
        'carbon-pattern': 'radial-gradient(#1e293b 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
}
