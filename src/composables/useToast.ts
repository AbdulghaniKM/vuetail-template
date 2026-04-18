import { ref } from 'vue';

// NOTE: Module-scope ref() state. SPA-only — not safe under SSR.

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
  duration?: number
}

interface TimerRecord {
  timeoutId: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

const toasts = ref<Toast[]>([]);
const timers = new Map<string, TimerRecord>();

let toastIdCounter = 0;

const generateId = (): string => {
  return `toast-${Date.now()}-${toastIdCounter++}`;
};

const startTimer = (id: string, duration: number) => {
  const timeoutId = setTimeout(() => removeToast(id), duration);
  timers.set(id, { timeoutId, remaining: duration, startedAt: Date.now() });
};

const pauseToast = (id: string): void => {
  const t = timers.get(id);
  if (!t) return;
  clearTimeout(t.timeoutId);
  t.remaining = Math.max(0, t.remaining - (Date.now() - t.startedAt));
};

const resumeToast = (id: string): void => {
  const t = timers.get(id);
  if (!t || t.remaining <= 0) return;
  const timeoutId = setTimeout(() => removeToast(id), t.remaining);
  timers.set(id, { timeoutId, remaining: t.remaining, startedAt: Date.now() });
};

const addToast = (toast: Omit<Toast, 'id'>): string => {
  const id = generateId();
  const newToast: Toast = {
    ...toast,
    id,
    duration: toast.duration ?? 5000,
  };

  toasts.value.push(newToast);

  if (newToast.duration && newToast.duration > 0) {
    startTimer(id, newToast.duration);
  }

  return id;
};

const removeToast = (id: string): void => {
  const t = timers.get(id);
  if (t) {
    clearTimeout(t.timeoutId);
    timers.delete(id);
  }
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const clearToasts = (): void => {
  for (const { timeoutId } of timers.values()) clearTimeout(timeoutId);
  timers.clear();
  toasts.value = [];
};

export const useToast = () => {
  const success = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({ type: 'success', message, ...options });
  };

  const error = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({ type: 'error', message, ...options });
  };

  const warning = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({ type: 'warning', message, ...options });
  };

  const info = (message: string, options?: { title?: string; duration?: number }) => {
    return addToast({ type: 'info', message, ...options });
  };

  return {
    toasts,
    success,
    error,
    warning,
    info,
    remove: removeToast,
    clear: clearToasts,
    pause: pauseToast,
    resume: resumeToast,
  };
};
