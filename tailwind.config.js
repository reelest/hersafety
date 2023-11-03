/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{components,pages,utils}/**/*.{js,html,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a45039",
        primaryDark: "#343019",
        secondary: "#ff8200",
        bg: "#f9f9fc",
        error: "#d32f2f",
        // primaryLight: MuiTheme.palette.primary.light,
        // error: MuiTheme.palette.error.main,
        // disabled: MuiTheme.palette.text.disabled,
        disabledOnPrimaryDark: "#aeafb5",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
