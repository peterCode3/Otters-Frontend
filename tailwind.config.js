/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,css}",         // ✅ Add this line
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        white: 'var(--color-white)',
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        text: 'var(--color-text)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        'blue-100': 'var(--color-blue-100)',
        'blue-400': 'var(--color-blue-400)',
        'purple-100': 'var(--color-purple-100)',
        'purple-400': 'var(--color-purple-400)',
        'purple-600': 'var(--color-purple-600)',
        'red-100': 'var(--color-red-100)',
        'red-600': 'var(--color-red-600)',
        'green-100': 'var(--color-green-100)',
        'green-600': 'var(--color-green-600)',
        'gray-50': 'var(--color-gray-50)',
        'gray-100': 'var(--color-gray-100)',
        'gray-200': 'var(--color-gray-200)',
        'gray-300': 'var(--color-gray-300)',
        'gray-400': 'var(--color-gray-400)',
        'gray-500': 'var(--color-gray-500)',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root': {
          '--color-background': '#f9f9f9',
          '--color-primary': '#00A3CF',
          '--color-text': '#00263D',
          '--color-secondary': '#6B7280',
          '--color-success': '#10B981',
          '--color-warning': '#F59E0B',
          '--color-danger': '#EF4444',
        },
        '[data-theme="dark"]': {
          '--color-background': '#0d1a26',
          '--color-primary': '#2e2e2e',
          '--color-text': '#fff',
          '--color-secondary': '#6B7280',
          '--color-success': '#10B981',
          '--color-warning': '#F59E0B',
          '--color-danger': '#EF4444',
        },
      });
    },
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake", "corporate", "synthwave", "dracula"],
  },
};
