/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Consumer cozy welcoming foundation
        porcelain: '#fafafc',
        oat: '#f7f7f5',
        background: '#fafafc',
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f7f7f5',
          porcelain: '#fafafc',
          oat: '#f7f7f5',
          elevated: '#ffffff',
          border: 'rgba(228, 228, 231, 0.8)',
        },
        darkbg: '#09090b',
        darksurface: {
          DEFAULT: '#121214',
          subtle: '#18181b',
          border: 'rgba(39, 39, 42, 0.8)',
        },
        // Warm organic accents (Apple Store & Grovemade DTC aesthetic)
        terracotta: {
          DEFAULT: '#ea580c',
          hover: '#c2410c',
          active: '#9a3412',
          light: '#ffedd5',
          subtle: '#fff7ed',
          dark: '#9a3412',
        },
        sage: {
          DEFAULT: '#15803d',
          hover: '#166534',
          active: '#14532d',
          light: '#dcfce7',
          subtle: '#f0fdf4',
          dark: '#14532d',
        },
        // Brand signals aligned with warm terracotta and sage palette
        signal: {
          orange: '#ea580c',        // warm terracotta primary
          orangeHover: '#c2410c',   // soft terracotta hover
          terracotta: '#ea580c',
          terracottaHover: '#c2410c',
          cyan: '#0284c7',          // soft studio sky blue
          cyanHover: '#0369a1',
          lime: '#15803d',          // warm organic sage green
          sage: '#15803d',
          sageHover: '#166534',
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
        'card-hover': '0 12px 28px -4px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'tactile': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'tactile-hover': '0 4px 14px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -3px rgba(0, 0, 0, 0.07)',
        'glow-terracotta': '0 4px 16px -2px rgba(234, 88, 12, 0.22)',
        'glow-orange': '0 4px 16px -2px rgba(234, 88, 12, 0.22)',
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
