module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'dark-bg': '#0A0A0A',
        'dark-card': '#121212',
        'gold-primary': '#D4AF37',
        'gold-secondary': '#F5E7A1',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #D4AF37 0%, #B8860B 100%)',
      },
      fontSize: {
        '2xs': '0.625rem', // 10px - для мелкого текста на мобильных
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}