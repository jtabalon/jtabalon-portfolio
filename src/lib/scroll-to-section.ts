import { Platform } from 'react-native';

export function scrollToSection(targetId: string) {
  if (Platform.OS === 'web') {
    document.getElementById(targetId)?.scrollIntoView();
  }
}
