/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Concept 1: Warm Minimalist DTC Foundation
        brand: {
          orange: '#FF6B00',
          'orange-hover': '#FF7A00',
          'orange-light': '#FFF4ED',
          dark: '#0F172A',
          DEFAULT: '#FF6B00',
        },
        'brand-orange': '#FF6B00',
        'brand-orange-hover': '#FF7A00',
        'brand-orange-light': '#FFF4ED',
        'brand-dark': '#0F172A',

        // Clean light surfaces & foundation
        canvas: '#FAFAFA',
        porcelain: '#FAFAFA',
        oat: '#F4F4F5',
        background: '#FAFAFA',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAFAFA',
          porcelain: '#FAFAFA',
          oat: '#F4F4F5',
          elevated: '#FFFFFF',
          border: 'rgba(226, 232, 240, 0.8)',
        },
        darkbg: '#0F172A',
        darksurface: {
          DEFAULT: '#1E293B',
          subtle: '#334155',
          border: 'rgba(51, 65, 85, 0.8)',
        },

        // Warm terracotta mapped to brand electric orange
        terracotta: {
          DEFAULT: '#FF6B00',
          hover: '#FF7A00',
          active: '#E05E00',
          light: '#FFF4ED',
          subtle: '#FFFAF5',
          dark: '#0F172A',
        },
        sage: {
          DEFAULT: '#15803d',
          hover: '#166534',
          active: '#14532d',
          light: '#dcfce7',
          subtle: '#f0fdf4',
          dark: '#14532d',
        },

        // Brand signals aligned with warm electric orange
        signal: {
          orange: '#FF6B00',
          orangeHover: '#FF7A00',
          terracotta: '#FF6B00',
          terracottaHover: '#FF7A00',
          cyan: '#0284c7',
          cyanHover: '#0369a1',
          lime: '#15803d',
          sage: '#15803d',
          sageHover: '#166534',
          amber: '#d97706',
        },
        precision: {
          zinc: '#64748B',
          muted: '#475569',
          dark: '#0F172A',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 16px 32px -6px rgba(15, 23, 42, 0.08), 0 6px 16px -4px rgba(15, 23, 42, 0.03)',
        'tactile': '0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)',
        'tactile-hover': '0 6px 16px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(15, 23, 42, 0.03)',
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 12px 36px -4px rgba(15, 23, 42, 0.08)',
        'glow-orange': '0 4px 20px -2px rgba(255, 107, 0, 0.28)',
        'glow-terracotta': '0 4px 20px -2px rgba(255, 107, 0, 0.28)',
        'glow-sage': '0 4px 16px -2px rgba(21, 128, 61, 0.22)',
        'glow-cyan': '0 4px 16px -2px rgba(2, 132, 199, 0.20)',
      },
      transitionTimingFunction: {
        'apple-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'tactile': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};
