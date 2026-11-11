import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const TOAST_STYLES = {
  success: {
    container: 'border-[#3DDC84]/45 bg-[#171717]/95 text-white',
    icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3DDC84]" aria-hidden="true" />,
  },
  error: {
    container: 'border-red-500/45 bg-[#171717]/95 text-white',
    icon: <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />,
  },
  info: {
    container: 'border-orange-500/45 bg-[#171717]/95 text-white',
    icon: <Info className="h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />,
  },
};

export function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        return (
          <div
            key={toast.id}
            role="status"
            className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded border px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-md ${style.container}`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {style.icon}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

