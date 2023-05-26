/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors:{
      primary: "#FF4B00",
      white:"#FFFFFF",
      black:"#000",
      button:"#FF4B00",
      red:"#FF0000",
    },
    extend: {
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["light", "dark","bumblebee"],
  },

}

