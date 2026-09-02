/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f0e7',
        panel: '#fbf7f0',
        ink: '#191512',
        muted: '#6d6255',
        line: '#d7ccb9',
        accent: '#725a3d',
        wash: '#efe7da',
      },
      fontFamily: {
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(25, 21, 18, 0.08)',
      },
      letterSpacing: {
        whisper: '0.24em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};
