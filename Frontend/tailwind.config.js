/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        sectionSurface: 'var(--section-surface)',
        borderCustom: 'var(--border-custom)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        textMain: 'var(--text-main)',
        subtext: 'var(--subtext)',
        cardBg: 'var(--card-bg)',
        dark: 'var(--background)', // Alias for backward compatibility
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'premium': 'var(--card-shadow)',
      }
    },
  },
  plugins: [],
}
