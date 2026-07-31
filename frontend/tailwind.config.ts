import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        foreground: '#111827',
        // Light Palette Tokens
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Accents
        indigo: {
          600: '#4F46E5',
          700: '#4338CA',
        },
        purple: {
          600: '#7C3AED',
        },
        pink: {
          500: '#EC4899',
        },
        amber: {
          500: '#D4AF37',
          600: '#B45309',
        },
        emerald: {
          500: '#10B981',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair-display)', 'Playfair Display', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['11px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        'card': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'gold': '0 4px 20px rgba(212,175,55,0.25)',
        'indigo': '0 4px 20px rgba(79,70,229,0.25)',
        'purple': '0 4px 20px rgba(124,58,237,0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'gradient-warm': 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'dot-grid-light': 'radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
