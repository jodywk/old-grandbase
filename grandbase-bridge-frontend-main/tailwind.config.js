/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        chakra_petch: ["Chakra Petch", "sans-serif"]
      },

      colors: {
        primary: "#ff5c00",
        secondary: "#ffe500",
        "primary-100": "#ff5c05",
        "secondary-100": "#ffe504",
      }
    },
  },
  plugins: [
    // require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"]
  },
}

