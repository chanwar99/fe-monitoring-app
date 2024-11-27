// tailwind.config.js
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  daisyui: {
    styled: true,
    themes: false,
    rtl: false
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')]
}
