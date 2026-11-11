import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_DURATION_MS = 3800;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);

      const timer = setTimeout(() => {
        dismissToast(id);
      }, TOAST_DURATION_MS);

      timersRef.current.set(id, timer);
      return id;
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}
