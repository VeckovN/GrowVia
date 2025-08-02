/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        warning: '#f0ad4e',
        success: '#5cb85c',
        error: '#d9534f',
        info: '#5bc0de',
        category: '#D5F0D3',
        mainBackground: '#F4F4F4',
        authPart: '#F2F2F2',
        greyOrder: '#FAFAFA',
        greySbtn: '#DDDDDD',
        grey: '#e8e8e8',
        greyB: '#8c8c8c',
        greyC: '#7C7C7C',
        green1: '#EAF7E9',
        green2: '#D5F0D3',
        green3: '#ABE0A7',
        green4: '#81D17C',
        green5: '#57C150',
        green6: '#2DB224',
        green7: '#248E1D',
        green8: '#1B6B16',
        green9: '#12470E',
        green10: '#092407',
        yellowVerification: '#FFBF35'

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      screens: {
        xs: '480px', //additional breakpoing for very small screens
      }
    }
  },
  plugins: []
};