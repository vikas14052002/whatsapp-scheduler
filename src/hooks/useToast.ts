import { useState, useCallback, useRef, useEffect } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, type: Toast['type'] = 'info', duration = 4000) {
  const id = Math.random().toString(36).slice(2, 9);
  const toast: Toast = { id, message, type, duration };
  toasts = [...toasts, toast];
  notifyListeners();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, duration);
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setLocalToasts);
    setLocalToasts([...toasts]);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setLocalToasts);
    };
  }, []);

  return localToasts;
}
