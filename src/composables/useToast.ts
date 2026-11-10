import { ref } from 'vue';

// NOTE: Module-scope ref() state. SPA-only — not safe under SSR.

/** `loading` is what promise() shows until the promise settles. */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * AppToastMorph only. When a toast with more to say (a description or an action) opens out of
 * its pill and folds back: `expand` ms after it appears, `collapse` ms before it leaves.
 * `false` keeps it a pill until hovered or focused.
 */
export type ToastAutopilot = false | { expand?: number; collapse?: number };

export interface ToastAction {
  label: string;
  /** Runs, then the toast closes. */
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  /** A second, longer line under the title. AppToastMorph shows it when the toast opens. */
  description?: string;
  /** An icon class (`icon-[heroicons--bell]`) in place of the type's own. */
  icon?: string;
  /** Overrides the toaster's position for this toast (AppToastMorph). */
  position?: ToastPosition;
  autopilot?: ToastAutopilot;
  /** ms until it closes; 0 keeps it until dismissed. */
  duration?: number;
  /** One button beside the message: Undo, Retry, View. */
  action?: ToastAction;
  /** True while the dismissal timer is paused (hover/focus) — freezes the progress bar. */
  paused?: boolean;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  icon?: string;
  position?: ToastPosition;
  autopilot?: ToastAutopilot;
  duration?: number;
  action?: ToastAction;
}

interface TimerRecord {
  timeoutId: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

const config = { max: 5, duration: 5000 };

/** App-wide toast settings. `max` toasts are shown at once (the oldest goes first). */
export const configureToasts = (options: { max?: number; duration?: number }): void => {
  if (options.max !== undefined) config.max = Math.max(1, options.max);
  if (options.duration !== undefined) config.duration = options.duration;
};

const toasts = ref<Toast[]>([]);
const timers = new Map<string, TimerRecord>();

let toastIdCounter = 0;

const generateId = (): string => {
  return `toast-${Date.now()}-${toastIdCounter++}`;
};

const clearTimer = (id: string) => {
  const t = timers.get(id);
  if (t) clearTimeout(t.timeoutId);
  timers.delete(id);
};

const startTimer = (id: string, duration: number) => {
  clearTimer(id);
  if (!(duration > 0)) return;
  const timeoutId = setTimeout(() => removeToast(id), duration);
  timers.set(id, { timeoutId, remaining: duration, startedAt: Date.now() });
};

const pauseToast = (id: string): void => {
  const t = timers.get(id);
  if (!t) return;
  clearTimeout(t.timeoutId);
  t.remaining = Math.max(0, t.remaining - (Date.now() - t.startedAt));
  const toast = toasts.value.find((x) => x.id === id);
  if (toast) toast.paused = true;
};

const resumeToast = (id: string): void => {
  const t = timers.get(id);
  if (!t || t.remaining <= 0) return;
  const timeoutId = setTimeout(() => removeToast(id), t.remaining);
  timers.set(id, { timeoutId, remaining: t.remaining, startedAt: Date.now() });
  const toast = toasts.value.find((x) => x.id === id);
  if (toast) toast.paused = false;
};

const removeToast = (id: string): void => {
  clearTimer(id);
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) toasts.value.splice(index, 1);
};

const addToast = (toast: Omit<Toast, 'id'>): string => {
  const id = generateId();
  const newToast: Toast = { ...toast, id, duration: toast.duration ?? config.duration };
  toasts.value.push(newToast);
  // A wall of toasts is unreadable and covers the page: past the limit, the oldest goes.
  while (toasts.value.length > config.max) removeToast(toasts.value[0].id);
  startTimer(id, newToast.duration!);
  return id;
};

/** Change a toast in place (message, type, duration…). A new duration restarts its timer. */
const updateToast = (id: string, patch: Partial<Omit<Toast, 'id'>>): void => {
  const toast = toasts.value.find((x) => x.id === id);
  if (!toast) return;
  Object.assign(toast, patch, { paused: false });
  if (patch.duration !== undefined) startTimer(id, patch.duration);
};

const clearToasts = (): void => {
  for (const { timeoutId } of timers.values()) clearTimeout(timeoutId);
  timers.clear();
  toasts.value = [];
};

type Outcome<T> = string | ((value: T) => string);

/**
 * A sticky "loading" toast that turns into the outcome. Resolves or rejects with the promise,
 * so `await toast.promise(save(), {...})` still sees the error.
 */
const promiseToast = async <T>(
  promise: Promise<T>,
  messages: { loading: string; success: Outcome<T>; error: Outcome<unknown> },
  options: Omit<ToastOptions, 'duration'> = {},
): Promise<T> => {
  const id = addToast({ type: 'loading', message: messages.loading, ...options, duration: 0 });
  const text = <V>(m: Outcome<V>, v: V) => (typeof m === 'function' ? m(v) : m);
  try {
    const value = await promise;
    updateToast(id, { type: 'success', message: text(messages.success, value), duration: config.duration });
    return value;
  } catch (e) {
    updateToast(id, { type: 'error', message: text(messages.error, e), duration: config.duration });
    throw e;
  }
};

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => addToast({ type: 'success', message, ...options });
  const error = (message: string, options?: ToastOptions) => addToast({ type: 'error', message, ...options });
  const warning = (message: string, options?: ToastOptions) => addToast({ type: 'warning', message, ...options });
  const info = (message: string, options?: ToastOptions) => addToast({ type: 'info', message, ...options });

  return {
    toasts,
    success,
    error,
    warning,
    info,
    update: updateToast,
    promise: promiseToast,
    remove: removeToast,
    clear: clearToasts,
    pause: pauseToast,
    resume: resumeToast,
  };
};
