import { ref } from 'vue';
import type { Toast } from '../components/AppToast.vue';

const toasts = ref<Toast[]>([]);

let toastIdCounter = 0;

const generateId = (): string => {
  return `toast-${Date.now()}-${toastIdCounter++}`;
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
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }

  return id;
};

const removeToast = (id: string): void => {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const clearToasts = (): void => {
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
  };
};
