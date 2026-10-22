/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: {
          DEFAULT: '#121214',
          subtle: '#18181b',
          elevated: '#202024',
          border: 'rgba(39, 39, 42, 0.8)',
        },
        signal: {
          orange: '#ff5500',
          cyan: '#00e5ff',
          lime: '#a3e635',
          amber: '#f59e0b',
        },
        precision: {
          zinc: '#71717a',
          muted: '#a1a1aa',
          white: '#f4f4f5',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
      },
      boxShadow: {
        'tactile': '0 1px 0 rgba(255, 255, 255, 0.08) inset, 0 1px 2px rgba(0, 0, 0, 0.6)',
        'tactile-active': '0 2px 4px rgba(0, 0, 0, 0.8) inset',
        'glow-orange': '0 0 20px -3px rgba(255, 85, 0, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(0, 229, 255, 0.35)',
      },
    },
  },
  plugins: [],
};
