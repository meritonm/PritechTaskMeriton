import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'success',

  show: (message, type = 'success') => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    set({ visible: true, message, type });
    hideTimer = setTimeout(() => {
      set({ visible: false });
      hideTimer = null;
    }, 3200);
  },

  hide: () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    set({ visible: false });
  },
}));
