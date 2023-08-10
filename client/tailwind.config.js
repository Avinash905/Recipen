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
        login:
          "url('https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1')",
        hero: "url('https://images.pexels.com/photos/916925/pexels-photo-916925.jpeg?auto=compress&cs=tinysrgb&w=720&dpr=1')",
      },
    },
  },
  plugins: [],
};
