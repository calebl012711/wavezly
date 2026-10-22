/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#fafafc',
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f4f4f7',
          elevated: '#ffffff',
          border: 'rgba(228, 228, 231, 0.9)',
        },
        darkbg: '#09090b',
        darksurface: {
          DEFAULT: '#121214',
          subtle: '#18181b',
          border: 'rgba(39, 39, 42, 0.8)',
        },
        signal: {
          orange: '#ff5500',
          orangeHover: '#ea4e00',
          cyan: '#0284c7',
          lime: '#16a34a',
          amber: '#d97706',
        },
        precision: {
          zinc: '#71717a',
          muted: '#52525b',
          dark: '#09090b',
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 14px 34px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'tactile': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'glow-orange': '0 4px 20px -2px rgba(255, 85, 0, 0.25)',
        'glow-cyan': '0 4px 20px -2px rgba(2, 132, 199, 0.25)',
      },
    },
  },
  plugins: [],
};
