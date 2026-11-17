import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette
        midnight: {
          DEFAULT: '#0f172a',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        ivory: {
          DEFAULT: '#faf8f5',
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f0ea',
          300: '#e8dfd4',
          400: '#d4c5b2',
        },
        verified: {
          DEFAULT: '#0d9488',
          light: '#ccfbf1',
          dark: '#065f53',
          bg: '#f0fdfa',
        },
        pending: {
          DEFAULT: '#d97706',
          light: '#fef3c7',
          dark: '#92400e',
          bg: '#fffbeb',
        },
        conflicting: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
          dark: '#991b1b',
          bg: '#fef2f2',
        },
        notproven: {
          DEFAULT: '#6366f1',
          light: '#e0e7ff',
          dark: '#3730a3',
          bg: '#eef2ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
