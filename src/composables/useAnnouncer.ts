/**
 * One place that speaks to screen readers. Two visually hidden live regions (polite and
 * assertive) are added to <body> the first time `useAnnouncer()` runs, so they exist before the
 * first message: a live region inserted together with its text is often not read at all.
 *
 * Components announce through it instead of keeping their own `aria-live` element, so a message
 * survives the component that sent it (a toast that closes, a row that is deleted).
 */

export type Politeness = 'polite' | 'assertive';

// Long enough for screen readers to notice the region was emptied, short enough not to lag.
const SPEAK_DELAY_MS = 50;

const regions = new Map<Politeness, HTMLElement>();
const timers = new Map<Politeness, ReturnType<typeof setTimeout>>();

const HIDDEN: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: '0',
};

const region = (politeness: Politeness): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  let el = regions.get(politeness);
  if (el?.isConnected) return el;
  el =
    document.querySelector<HTMLElement>(`[data-vt-announcer="${politeness}"]`) ??
    document.createElement('div');
  el.setAttribute('data-vt-announcer', politeness);
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  Object.assign(el.style, HIDDEN);
  if (!el.isConnected) document.body.appendChild(el);
  regions.set(politeness, el);
  return el;
};

/**
 * Say `message` to screen-reader users. `assertive` interrupts: keep it for errors and anything
 * that needs action now. Messages sent within one burst collapse to the last; the same message
 * twice in a row is still read twice.
 */
export const announce = (message: string, politeness: Politeness = 'polite'): void => {
  const el = region(politeness);
  if (!el) return;
  el.textContent = '';
  clearTimeout(timers.get(politeness));
  timers.set(
    politeness,
    setTimeout(() => {
      el.textContent = message;
    }, SPEAK_DELAY_MS),
  );
};

export const useAnnouncer = () => {
  region('polite');
  region('assertive');
  return { announce };
};
