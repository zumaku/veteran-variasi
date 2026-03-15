// Simple observer-based store for toasts (no external dependencies required)

// Simple zustand-like store for toasts without adding zustand dependency
// since I can't install new packages, I'll use a standard React state pattern
// or a simple event emitter.

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toasts: Toast[]) => void;
let listeners: ToastListener[] = [];
let toasts: Toast[] = [];

const notify = () => {
  listeners.forEach((listener) => listener(toasts));
};

export const toast = {
  subscribe: (listener: ToastListener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  success: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: 'success' }];
    notify();
    setTimeout(() => toast.dismiss(id), 5000);
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type: 'error' }];
    notify();
    setTimeout(() => toast.dismiss(id), 5000);
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};
