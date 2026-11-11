import { useEffect, useRef, useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';

const PRIORITIES = ['low', 'medium', 'high'];
const MAX_TITLE_LENGTH = 120;
const MAX_DESC_LENGTH = 500;

export function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [completed, setCompleted] = useState(Boolean(task?.completed));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setCompleted(Boolean(task.completed));
    setErrors({});
    setTimeout(() => titleInputRef.current?.focus(), 20);
  }, [task]);

  useEffect(() => {
    if (!task) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, saving, onClose]);

  if (!task) return null;

  const validate = () => {
    const nextErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      nextErrors.title = 'Task title cannot be empty.';
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      nextErrors.title = `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
    }

    if (description.trim().length > MAX_DESC_LENGTH) {
      nextErrors.description = `Description cannot exceed ${MAX_DESC_LENGTH} characters.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    try {
      await onSave(task._id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        completed,
      });
      onClose();
    } catch {
      // Error toast is triggered by useTasks.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-heading"
      onClick={() => !saving && onClose()}
    >
      <div
        className="animate-modal-in w-full max-w-lg rounded border border-[#262626] bg-[#171717] p-5 shadow-2xl shadow-black/70 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#262626] pb-3.5">
          <h2 id="edit-task-heading" className="text-lg font-bold text-white">
            Edit Task
          </h2>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close edit modal"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-[#262626] hover:text-white disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edit-task-title"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-400"
            >
              Title <span className="text-orange-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title && e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              disabled={saving}
              aria-invalid={Boolean(errors.title)}
              className={`focus-ring w-full rounded border bg-[#0A090F] px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 ${
                errors.title ? 'border-red-500/70' : 'border-[#262626]'
              }`}
            />
            {errors.title && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-task-description"
              className="mb-1.5 block text-xs font-medium text-neutral-400"
            >
              Description
            </label>
            <textarea
              id="edit-task-description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description && e.target.value.trim().length <= MAX_DESC_LENGTH) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              disabled={saving}
              placeholder="Optional description..."
              className={`focus-ring w-full resize-none rounded border bg-[#0A090F] px-3.5 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 ${
                errors.description ? 'border-red-500/70' : 'border-[#262626]'
              }`}
            />
            {errors.description && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-medium text-neutral-400">
                Priority
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {PRIORITIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    disabled={saving}
                    onClick={() => setPriority(level)}
                    aria-pressed={priority === level}
                    className={`focus-ring btn-smooth min-h-[38px] rounded border text-xs font-medium capitalize ${
                      priority === level
                        ? 'border-orange-500/60 bg-orange-500/20 text-orange-300'
                        : 'border-[#262626] bg-[#0A090F] text-neutral-400 hover:border-[#ff7300]/50 hover:text-neutral-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-neutral-400">
                Status
              </span>
              <button
                type="button"
                disabled={saving}
                onClick={() => setCompleted((prev) => !prev)}
                aria-pressed={completed}
                className={`focus-ring btn-smooth flex min-h-[38px] w-full items-center justify-center rounded border px-3 text-xs font-semibold ${
                  completed
                    ? 'border-[#3DDC84]/50 bg-[#3DDC84]/15 text-[#3DDC84]'
                    : 'border-[#262626] bg-[#0A090F] text-neutral-300 hover:border-orange-500/40'
                }`}
              >
                {completed ? 'Completed' : 'Active (Incomplete)'}
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-[#262626] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="focus-ring btn-smooth min-h-[42px] rounded border border-[#404040] bg-[#0A090F] px-4 py-2 text-sm font-medium text-neutral-300 hover:border-[#ff7300]/60 hover:text-[#ff7300] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="focus-ring btn-smooth btn-sweep inline-flex min-h-[42px] items-center justify-center gap-2 rounded border border-[#ff7300] bg-[#0A090F] px-5 py-2 text-sm font-semibold text-[#ff7300] shadow-[0_0_14px_rgba(255,115,0,0.18)] hover:bg-[#ff7300] hover:text-white hover:shadow-[0_0_22px_rgba(255,115,0,0.4)] disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

