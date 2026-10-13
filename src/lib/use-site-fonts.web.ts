import { FontDisplay, useFonts } from 'expo-font';

// These keep the native font-family aliases and outlines, with smaller web copies.
// Expo emits their font faces and preloads into the initial HTML as well.
export function useSiteFonts() {
  useFonts({
    Inter_400Regular: {
      uri: '/fonts/inter-400-latin.woff2',
      display: FontDisplay.SWAP,
    },
    Inter_500Medium: {
      uri: '/fonts/inter-500-latin.woff2',
      display: FontDisplay.SWAP,
    },
    Inter_600SemiBold: {
      uri: '/fonts/inter-600-latin.woff2',
      display: FontDisplay.SWAP,
    },
    JetBrainsMono_400Regular: {
      uri: '/fonts/jetbrains-mono-400-latin.woff2',
      display: FontDisplay.SWAP,
    },
    JetBrainsMono_500Medium: {
      uri: '/fonts/jetbrains-mono-500-latin.woff2',
      display: FontDisplay.SWAP,
    },
  });

  // Reading and contact links never wait for network fonts on the web.
  return true;
}
