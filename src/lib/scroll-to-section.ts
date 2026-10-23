import { Platform, type GestureResponderEvent } from 'react-native';

function currentFragmentId() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return undefined;
  }
}

export function scrollToSection(targetId: string, event?: GestureResponderEvent) {
  if (Platform.OS !== 'web') return;

  if (event) {
    const pointer = event.nativeEvent;
    if (pointer instanceof MouseEvent && (
      pointer.button !== 0 || pointer.metaKey || pointer.ctrlKey
      || pointer.shiftKey || pointer.altKey
    )) return;

    // Changed hashes are focused once by the committed route. Re-focusing here
    // as well could steal focus back after the reader has already pressed Tab.
    if (currentFragmentId() !== targetId) return;
    // Repeated hashes have no route update. Wait for the browser's click focus,
    // and discard the request if a newer navigation has changed the destination.
    requestAnimationFrame(() => {
      if (currentFragmentId() === targetId) scrollToSection(targetId);
    });
    return;
  }

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
