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
        accent: '#8f7553',
        wash: '#efe7da',
        paper: '#fafaf9',
        graphite: '#0f1115',
        slate: '#5a5f66',
        hairline: '#e6e4df',
        signal: '#16a34a',
      },
      fontFamily: {
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
        display: ['CormorantGaramond_600SemiBold'],
        'display-bold': ['CormorantGaramond_700Bold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
      },
      boxShadow: {
        paper: '0 18px 60px rgba(25, 21, 18, 0.08)',
      },
      letterSpacing: {
        whisper: '0.24em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};
