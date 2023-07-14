/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{components,pages,utils}/**/*.{js,html,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#170dd8",
        secondary: "#ff8200",
      },
    },
  },
  plugins: [],
};
