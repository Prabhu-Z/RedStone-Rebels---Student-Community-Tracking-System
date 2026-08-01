/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact Homepage Palette Colors
        homegold: {
          100: '#FFFBEB',
          200: '#FEF3C7',
          300: '#FDE68A',
          400: '#FFE088',
          500: '#F2CA50', // Homepage Golden Accent (#F2CA50)
          600: '#D9B436',
          700: '#B89623',
        },
        homegolddark: '#3C2F00',
        hometext: '#E2E2E8',
        homemuted: '#D0C5AF',
        homeblack: '#000000',
        homecard: '#121216',

        // Theme Aliases (Mapped to Homepage Gold Palette System)
        almond: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#D0C5AF',
          300: '#E2E2E8', // Primary Text
          400: '#FFE088',
          500: '#F2CA50', // Gold Accent
          600: '#D9B436',
          700: '#121216',
          800: '#0A0A0E',
          900: '#000000',
        },
        chestnut: {
          500: '#FFE088',
          600: '#F2CA50',
          700: '#D9B436',
          800: '#121216',
          900: '#000000',
        },
        arsenic: {
          700: '#1C1C24',
          800: '#121216',
          900: '#0A0A0E',
          950: '#000000',
        },
        warmgold: {
          300: '#E2E2E8',
          400: '#FFE088',
          500: '#F2CA50',
          600: '#D9B436',
        },
        burntcoffee: {
          400: '#1C1C24',
          500: '#121216',
          600: '#0A0A0E',
          700: '#000000',
          800: '#000000',
        },
        stardustsilver: {
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E2E8',
          400: '#D0C5AF',
          500: '#94A3B8',
        },
        voidcosmos: {
          950: '#000000',
          900: '#000000',
          800: '#0A0A0E',
          700: '#121216',
          600: '#1C1C24',
        },
        nebulaviolet: {
          300: '#E2E2E8',
          400: '#FFE088',
          500: '#F2CA50',
          600: '#D9B436',
          700: '#B89623',
        },
        pulsarblue: {
          400: '#FFE088',
          500: '#F2CA50',
          600: '#D9B436',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(242, 202, 80, 0.45)',
        'home-card': '0 10px 30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-interactive': 'floatInteractive 5s ease-in-out infinite',
      },
      keyframes: {
        floatInteractive: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
