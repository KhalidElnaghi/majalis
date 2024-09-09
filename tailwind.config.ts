/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  // TODO: Collect color codes from XD design file, Check whether to use Local font files or use Google fonts CDN
  theme: {
    extend: {
      colors: {
        primary: '#1492e6',
        info: '#06A79A',
        success: '#307456',
        danger: '#CB393B',
        warning: '#E6AD0B',
        light: '#f8f8fb',
        disabled: '#A29F9D',
        status: {
          primary: '#1492e6',
          success: '#34A853',
          danger: '#EA4335',
          light_danger: '#FF7362',
          warning: '#FFA700',
        },
        disabledText: '#707070',
      },

      // TODO: Add Montserrat and Montserrat-Arabic
      fontFamily: {
        montserrat_ar: ['Montserrat-Arabic'],
        montserrat_en: ['Montserrat'],
        cairo: ['Cairo'],
      },
    },
  },
  plugins: [],
};
