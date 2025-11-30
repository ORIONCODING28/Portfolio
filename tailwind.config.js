/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary
        'deep-indigo': {
          DEFAULT: '#1a1a3e',
          50: '#f5f5ff',
          100: '#ebebff',
          200: '#d6d6ff',
          300: '#b3b3ff',
          400: '#8080ff',
          500: '#4d4dff',
          600: '#3333cc',
          700: '#252558',
          800: '#1a1a3e',
          900: '#0f0f24',
          950: '#080812',
        },
        // Accent
        'electric-violet': {
          DEFAULT: '#9D4EDD',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#9D4EDD',
          600: '#7B2CBF',
          700: '#6b21a8',
          800: '#581c87',
          900: '#3b0764',
        },
        // Secondary
        'soft-cyan': {
          DEFAULT: '#00D9FF',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00D9FF',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        'teal': {
          DEFAULT: '#00B8CC',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#00B8CC',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        'outfit': ['Outfit', 'system-ui', 'sans-serif'],
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(157, 78, 221, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(157, 78, 221, 0.8)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(157, 78, 221, 0.3)',
        'glow-lg': '0 0 60px rgba(157, 78, 221, 0.4)',
        'glow-cyan': '0 0 40px rgba(0, 217, 255, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(157, 78, 221, 0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

