/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
          dark: '#0a0a0a',
        },
        secondary: {
          DEFAULT: '#00ffff',
          light: '#00d4ff',
          dark: '#00b8cc',
        },
        surface: {
          DEFAULT: '#1a1a1a',
          light: '#2a2a2a',
          dark: '#0a0a0a',
        },
        glow: {
          DEFAULT: '#00ffff',
          secondary: '#00d4ff',
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
        'arcane': ['Times New Roman', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-arcane': 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        'gradient-glow': 'linear-gradient(135deg, #00ffff 0%, #00d4ff 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 255, 255, 0.7)',
        'glow-xl': '0 0 60px rgba(0, 255, 255, 0.9)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
