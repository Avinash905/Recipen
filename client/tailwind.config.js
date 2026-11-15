/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffaa07",
        primaryLight: "#ffb629",
        light: "#fffefc",
      },
      backgroundImage: {
        login: "url('./assets/auth-banner.webp')",
        hero: "url('https://images.pexels.com/photos/916925/pexels-photo-916925.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1')",
      },
    },
  },
  plugins: [],
};
