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
    if (pointer instanceof MouseEvent || pointer instanceof KeyboardEvent) {
      if ((pointer instanceof MouseEvent && pointer.button !== 0)
        || pointer.metaKey || pointer.ctrlKey || pointer.shiftKey || pointer.altKey) return;
    }

    // Expo's same-route navigation replaces browser history. Native fragment links
    // preserve section Back/Forward entries; prevent the merged Link handler
    // from replacing them. The committed route remains the only focus owner.
    event.preventDefault();
    if (window.location.pathname !== '/' || window.location.search !== ''
      || currentFragmentId() !== targetId) {
      window.location.assign(`/#${encodeURIComponent(targetId)}`);
      return;
    }
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

  // A short viewport can show the section's portrait while clipping its focused
  // heading. Keep section context when it fits; otherwise reveal the focus target.
  const bounds = destination.getBoundingClientRect();
  const style = getComputedStyle(destination);
  const outlineInset = style.outlineStyle === 'none' ? 0
    : Math.max(0, (parseFloat(style.outlineWidth) || 0) + (parseFloat(style.outlineOffset) || 0));
  if (bounds.top < outlineInset || bounds.bottom > window.innerHeight - outlineInset) {
    destination.scrollIntoView({
      behavior: 'instant',
      block: bounds.height + outlineInset * 2 <= window.innerHeight ? 'center' : 'start',
    });
  }
}
