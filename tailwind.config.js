/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'selector', // Activa el modo oscuro cuando la clase 'dark' está presente
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#f9f9f9',
          100: '#ececec',
          200: '#eaddd7',
          300: '#cdcdcd',
          400: '#b4b4b4',
          500: '#9b9b9b',
          600: '#676767',
          650: '#424242',
          700: '#303030',
          750: '#2f2f2f',
          800: '#212121',
          900: '#171717',
          950: '#0d0d0d'
        },
      }
    },
  },
  plugins: [],
}
