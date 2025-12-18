/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '1150px',
      },
      fontFamily: {
        'sans': ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'geist': ['Geist', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
        'serif': ['var(--font-playfair)', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        'primary': '#1a1a1a',
        'accent': '#4a90e2',
      },
    },
  },
  plugins: [],
}
