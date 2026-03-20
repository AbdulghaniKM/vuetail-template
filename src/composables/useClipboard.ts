import { ref } from 'vue';
import { useToast } from './useToast';

export const useClipboard = (options?: { resetAfter?: number }) => {
  const resetAfter = options?.resetAfter ?? 2000;
  const copied = ref(false);
  const isSupported = typeof navigator !== 'undefined' && !!navigator.clipboard;

  let timer: ReturnType<typeof setTimeout> | null = null;

  const copy = async (text: string, showToast = false): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        copied.value = false;
      }, resetAfter);

      if (showToast) {
        const { success } = useToast();
        success('Copied to clipboard');
      }

      return true;
    } catch {
      copied.value = false;
      return false;
    }
  };

  return { copy, copied, isSupported };
};
