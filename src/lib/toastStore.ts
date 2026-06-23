import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ShowToastOptions {
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  action: ToastAction | null;
  show: (message: string, typeOrOptions?: ToastType | ShowToastOptions) => void;
  hide: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

function resolveOptions(typeOrOptions?: ToastType | ShowToastOptions): ShowToastOptions {
  if (typeof typeOrOptions === 'string') {
    return { type: typeOrOptions };
  }
  return typeOrOptions ?? {};
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'success',
  action: null,

  show: (message, typeOrOptions) => {
    const { type = 'success', duration = 3200, action = null } = resolveOptions(typeOrOptions);

    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    set({ visible: true, message, type, action });

    hideTimer = setTimeout(() => {
      set({ visible: false, action: null });
      hideTimer = null;
    }, action ? Math.max(duration, 5000) : duration);
  },

  hide: () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    set({ visible: false, action: null });
  },
}));
