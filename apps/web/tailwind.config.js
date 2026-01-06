/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Sage/Forest Green
        primary: {
          50: '#f4f7f4',
          100: '#e4ebe4',
          200: '#c9d9c9',
          300: '#a3bfa3',
          400: '#7a9f7a',
          500: '#5a8a5a', // Main sage green
          600: '#476e47',
          700: '#3a5a3a',
          800: '#314a31',
          900: '#2a3f2a',
        },
        // Secondary - Warm gold/yellow accent
        gold: {
          50: '#fefcf3',
          100: '#fef8e1',
          200: '#fcefc3',
          300: '#f9e29a',
          400: '#f5d06a',
          500: '#e9b93f', // Warm gold
          600: '#d49b24',
          700: '#b17a1c',
          800: '#8f611d',
          900: '#76501c',
        },
        // Sage variations for depth
        sage: {
          50: '#f6f8f6',
          100: '#e8efe8',
          200: '#d1dfd1',
          300: '#adc7ad',
          400: '#84aa84',
          500: '#628f62', // Soft sage
          600: '#4d734d',
          700: '#405d40',
          800: '#364c36',
          900: '#2e402e',
        },
        // Cream/off-white for light backgrounds
        cream: {
          50: '#fefefe',
          100: '#fafbf8', // Light mode background
          200: '#f4f6f2',
          300: '#eaede6',
          400: '#dde2d8',
          500: '#cfd6c9',
          600: '#b8c2b0',
          700: '#9aa692',
          800: '#7d8a75',
          900: '#667160',
        },
        // Forest - darker greens
        forest: {
          50: '#f2f5f2',
          100: '#e0e8e0',
          200: '#c2d1c2',
          300: '#9ab49a',
          400: '#6f946f',
          500: '#527852',
          600: '#406040',
          700: '#354e35',
          800: '#2d402d',
          900: '#263626',
        },
        // Warm accent - soft terracotta/coral for contrast
        warm: {
          50: '#fef6f4',
          100: '#fdeae6',
          200: '#fad4cc',
          300: '#f5b5a5',
          400: '#ed8c73',
          500: '#e26b4a',
          600: '#cf5133',
          700: '#ad4129',
          800: '#8f3826',
          900: '#773325',
        },
        // Sand - warm beige tones (for backgrounds)
        sand: {
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f5f1e8',
          300: '#ede7d9',
          400: '#e2d9c6',
          500: '#d4c8ad',
          600: '#c0b08e',
          700: '#a69470',
          800: '#887859',
          900: '#70634a',
        },
        // Coral - warm accent color
        coral: {
          50: '#fff5f3',
          100: '#ffe9e4',
          200: '#ffd4cc',
          300: '#ffb3a5',
          400: '#ff8c78',
          500: '#f56b52',
          600: '#e24d33',
          700: '#be3d27',
          800: '#9c3524',
          900: '#823024',
        },
        // Lavender - soft purple accent
        lavender: {
          50: '#faf8fc',
          100: '#f4f0f9',
          200: '#ebe3f4',
          300: '#dccfeb',
          400: '#c5b2dd',
          500: '#ab91cb',
          600: '#9474b5',
          700: '#7d5e9c',
          800: '#694f81',
          900: '#57426a',
        },
        // Healing - soft teal/green
        healing: {
          50: '#f2faf8',
          100: '#e0f5f0',
          200: '#c3ebe1',
          300: '#98dbcc',
          400: '#66c4b1',
          500: '#44a894',
          600: '#338879',
          700: '#2d6d63',
          800: '#285851',
          900: '#254944',
        },
        // Dark mode specific colors - forest dark
        dark: {
          50: '#3a4238',
          100: '#2d352b',
          200: '#252d24',
          300: '#1e251d', // Dark mode cards
          400: '#181e17',
          500: '#131913', // Dark mode background
          600: '#0f140f',
          700: '#0b0f0b',
          800: '#070a07',
          900: '#040504',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': ['1.125rem', { lineHeight: '1.75' }],
        'body-lg': ['1.25rem', { lineHeight: '1.75' }],
        'heading': ['1.5rem', { lineHeight: '1.4' }],
        'title': ['2rem', { lineHeight: '1.3' }],
        'hero': ['2.5rem', { lineHeight: '1.2' }],
      },
      spacing: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(224, 123, 69, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(224, 123, 69, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
