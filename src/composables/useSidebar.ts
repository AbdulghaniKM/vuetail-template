import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'app-sidebar-collapsed';

const readStored = (): boolean => {
  if (typeof localStorage === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const writeStored = (value: boolean): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    if (value) localStorage.setItem(STORAGE_KEY, '1');
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
};

const collapsed = ref<boolean>(readStored());
const mobileOpen = ref<boolean>(false);

watch(collapsed, writeStored);

export const useSidebar = () => {
  const toggle = () => {
    collapsed.value = !collapsed.value;
  };

  const toggleMobile = () => {
    mobileOpen.value = !mobileOpen.value;
  };

  const closeMobile = () => {
    mobileOpen.value = false;
  };

  return {
    collapsed,
    mobileOpen,
    isExpanded: computed(() => !collapsed.value),
    toggle,
    toggleMobile,
    closeMobile,
  };
};
