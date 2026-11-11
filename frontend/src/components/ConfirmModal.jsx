import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !confirming) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirming, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await onConfirm();
      onCancel();
    } catch {
      // Error toast is handled by useTasks.
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={() => !confirming && onCancel()}
    >
      <div
        className="animate-modal-in w-full max-w-md rounded border border-[#262626] bg-[#171717] p-5 shadow-2xl shadow-black/70 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="confirm-modal-title" className="text-base font-bold text-white sm:text-lg">
              {title}
            </h2>
          </div>

          <button
            type="button"
            disabled={confirming}
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded text-neutral-400 hover:bg-[#262626] hover:text-white disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-300">{message}</p>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={confirming}
            onClick={onCancel}
            className="focus-ring btn-smooth min-h-[42px] rounded border border-[#404040] bg-[#0A090F] px-4 py-2 text-sm font-medium text-neutral-300 hover:border-[#ff7300]/60 hover:text-[#ff7300] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={confirming}
            onClick={handleConfirm}
            className="focus-ring btn-smooth btn-sweep inline-flex min-h-[42px] items-center justify-center gap-2 rounded border border-red-500 bg-[#0A090F] px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-60"
          >
            {confirming && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            <span>{confirming ? 'Deleting...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

