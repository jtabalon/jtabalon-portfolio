import { Platform } from 'react-native';

export function scrollToSection(targetId: string) {
  if (Platform.OS !== 'web') return;

  const section = document.getElementById(targetId);
  if (!section) return;

  // Announce the destination heading and continue Tab from this point, including
  // sections without links. Negative tabindex never adds a sequential Tab stop.
  const heading = section.querySelector<HTMLElement>('h1, h2, [role="heading"]');
  const destination = heading ?? section;
  if (!destination.hasAttribute('tabindex')) {
    destination.setAttribute('tabindex', '-1');
    destination.addEventListener(
      'blur',
      () => destination.removeAttribute('tabindex'),
      { once: true },
    );
  }
  destination.focus({ preventScroll: true });
  section.scrollIntoView({ behavior: 'instant', block: 'start' });
}
