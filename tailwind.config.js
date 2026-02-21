/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Blue shades
          'blue': {
            '50': '#eff6ff',
            '100': '#dbeafe',
            '200': '#bfdbfe',
            '300': '#93c5fd',
            '400': '#60a5fa',
            '500': '#3b82f6',
            '600': '#2563eb',
            '700': '#1d4ed8',
            '800': '#1e40af',
            '900': '#1e3a8a',
          },
          // Red shades
          'red': {
            '50': '#fef2f2',
            '100': '#fee2e2',
            '200': '#fecaca',
            '300': '#fca5a5',
            '400': '#f87171',
            '500': '#ef4444',
            '600': '#dc2626',
            '700': '#b91c1c',
            '800': '#991b1b',
            '900': '#7f1d1d',
          },
          // Black/Gray shades
          'gray': {
            '50': '#f9fafb',
            '100': '#f3f4f6',
            '200': '#e5e7eb',
            '300': '#d1d5db',
            '400': '#9ca3af',
            '500': '#6b7280',
            '600': '#4b5563',
            '700': '#374151',
            '800': '#1f2937',
            '900': '#111827',
          }
        },
        fontFamily: {
          sans: [
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'sans-serif',
          ],
        },
        boxShadow: {
          'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        },
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
        },
        borderRadius: {
          'sm': '0.125rem',
          'DEFAULT': '0.25rem',
          'md': '0.375rem',
          'lg': '0.5rem',
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          'full': '9999px',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-in-out',
          'slide-in': 'slideIn 0.3s ease-in-out',
          'scale-in': 'scaleIn 0.3s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideIn: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          scaleIn: {
            '0%': { transform: 'scale(0.9)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  }