import { ref, createApp, h, type App } from 'vue';
import ConfirmDangerModal from '../components/global/ConfirmDangerModal.vue';

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

let activeApp: App | null = null;
let activeContainer: HTMLElement | null = null;

function cleanup() {
  if (activeApp) {
    activeApp.unmount();
    activeApp = null;
  }
  if (activeContainer) {
    activeContainer.remove();
    activeContainer = null;
  }
}

export const useConfirm = () => {
  const confirm = (options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      cleanup();

      const container = document.createElement('div');
      document.body.appendChild(container);
      activeContainer = container;

      const isOpen = ref(true);

      const app = createApp({
        setup() {
          const handleClose = () => {
            isOpen.value = false;
            setTimeout(() => {
              cleanup();
              resolve(false);
            }, 300);
          };

          const handleConfirm = () => {
            isOpen.value = false;
            setTimeout(() => {
              cleanup();
              resolve(true);
            }, 300);
          };

          return () =>
            h(ConfirmDangerModal, {
              isOpen: isOpen.value,
              title: options.title ?? 'Are you sure?',
              message: options.message ?? 'This action cannot be undone.',
              confirmLabel: options.confirmLabel ?? 'Confirm',
              cancelLabel: options.cancelLabel ?? 'Cancel',
              onClose: handleClose,
              onConfirm: handleConfirm,
            });
        },
      });

      activeApp = app;
      app.mount(container);
    });
  };

  return { confirm };
};
