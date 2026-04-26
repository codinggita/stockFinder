/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        navy: '#1e293b',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        border: 'rgba(255, 255, 255, 0.1)',
        glow: 'rgba(59, 130, 246, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
