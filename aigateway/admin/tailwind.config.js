/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#f8f9fa',
        card: '#ffffff',
        border: '#e2e8f0',
        primary: '#2563eb',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'text-btn': '#334155',
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        input: '4px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
