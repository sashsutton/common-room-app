/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#465362',
        accent: '#EAC67A',
        secondary: '#AEC6CF',
        background: '#F6F6F3',
        ink: '#2B2B2B',
        subtext: '#999999',
        error: '#B05A5A',
        category: {
          creativity: '#E6CFF1',
          health: '#A7D7C5',
          lifework: '#C1C8E4',
          relationships: '#F6B5B5',
          self: '#F5DEB3',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
