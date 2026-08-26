/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2430',
        cloud: '#f6f4ef',
        sage: {
          50: '#f2f7f3',
          100: '#dcece0',
          200: '#b8d8c1',
          300: '#8fbf9d',
          400: '#66a67a',
          500: '#4a8c60',
          600: '#39704b',
          700: '#2e5a3d',
        },
        clay: {
          400: '#e3a374',
          500: '#d6875a',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
