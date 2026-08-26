/** @type {import('tailwindcss').Config} */
function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue === undefined ? `rgb(var(${variable}))` : `rgb(var(${variable}) / ${opacityValue})`
}

export default {
  darkMode: ['selector', '[data-theme="midnight-gold"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: withOpacity('--color-bg'),
        surface: withOpacity('--color-surface'),
        surfaceMuted: withOpacity('--color-surface-muted'),
        ink: withOpacity('--color-ink'),
        muted: withOpacity('--color-muted'),
        border: withOpacity('--color-border'),
        accent: withOpacity('--color-accent'),
        accentSoft: withOpacity('--color-accent-soft'),
        accentInk: withOpacity('--color-accent-ink'),
        gold: withOpacity('--color-gold'),
        warn: withOpacity('--color-warn'),
        warnSoft: withOpacity('--color-warn-soft'),
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Amiri"', 'Georgia', 'serif'],
        sans: [
          '"Inter"',
          '"Noto Sans Arabic"',
          '"Noto Sans SC"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        lux: '0 1px 2px rgb(var(--color-ink) / 0.04), 0 8px 24px -8px rgb(var(--color-ink) / 0.12)',
      },
    },
  },
  plugins: [],
}
