/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: '#ECEEF1',
        frost: '#FAFBFC',
        asphalt: '#1B1E26',
        slate: '#5A6270',
        amber: '#FF8A00',
        signal: {
          green: '#3B8A3B',
          red: '#C83838',
        },
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['Onest', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
