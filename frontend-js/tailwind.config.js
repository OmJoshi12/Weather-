module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff6ec7',
          blue: '#60a5fa',
          cyan: '#22d3ee',
          purple: '#a78bfa'
        }
      }
    }
  },
  plugins: []
};
