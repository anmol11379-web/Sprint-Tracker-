import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';

const PRIORITIES = [
  {
    value: 'low',
    label: 'Low',
    activeClass:
      'border-[#3DDC84]/50 bg-[#3DDC84]/15 text-[#3DDC84] shadow-sm shadow-[#3DDC84]/10',
  },
  {
    value: 'medium',
    label: 'Medium',
    activeClass:
      'border-amber-400/50 bg-amber-400/15 text-amber-300 shadow-sm shadow-amber-500/10',
  },
  {
    value: 'high',
    label: 'High',
    activeClass:
      'border-orange-500/60 bg-orange-500/20 text-orange-300 shadow-sm shadow-orange-500/15',
  },
];

const MAX_TITLE_LENGTH = 120;
const MAX_DESC_LENGTH = 500;

export function TaskForm({ onAddTask, submitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      nextErrors.title = 'Please enter a task title.';
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
    if (submitting || !validate()) return;

    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setErrors({});
    } catch {
      // Error feedback is handled by the toast notification in useTasks.
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (errors.title && value.trim().length > 0 && value.trim().length <= MAX_TITLE_LENGTH) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (errors.description && value.trim().length <= MAX_DESC_LENGTH) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded border border-[#262626] bg-[#171717]/95 p-4 shadow-xl shadow-black/30 backdrop-blur-sm sm:p-5"
    >
      <div className="flex flex-col gap-3.5">
        {/* Title Input */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="new-task-title"
              className="text-xs font-medium uppercase tracking-wider text-neutral-400"
            >
              New Task <span className="text-orange-500">*</span>
            </label>
            {title.length >= 80 && (
              <span
                className={`text-xs ${
                  title.trim().length > MAX_TITLE_LENGTH
                    ? 'text-red-400'
                    : 'text-neutral-500'
                }`}
              >
                {title.trim().length}/{MAX_TITLE_LENGTH}
              </span>
            )}
          </div>
          <input
            id="new-task-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            disabled={submitting}
            placeholder="What needs to get done? (e.g., Ship Android Club API docs)"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'new-task-title-error' : undefined}
            className={`focus-ring w-full rounded border bg-[#0A090F] px-3.5 py-3 text-sm text-white placeholder-neutral-500 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.title
                ? 'border-red-500/70 focus-visible:ring-red-500/70'
                : 'border-[#262626] hover:border-[#404040] focus:border-orange-500/70'
            }`}
          />
          {errors.title && (
            <p
              id="new-task-title-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-400"
            >
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="new-task-description"
              className="text-xs font-medium text-neutral-400"
            >
              Description <span className="text-neutral-600">(optional)</span>
            </label>
            {description.length >= 350 && (
              <span
                className={`text-xs ${
                  description.trim().length > MAX_DESC_LENGTH
                    ? 'text-red-400'
                    : 'text-neutral-500'
                }`}
              >
                {description.trim().length}/{MAX_DESC_LENGTH}
              </span>
            )}
          </div>
          <textarea
            id="new-task-description"
            rows={2}
            value={description}
            onChange={handleDescriptionChange}
            disabled={submitting}
            placeholder="Add context, acceptance criteria, or quick notes..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? 'new-task-desc-error' : undefined
            }
            className={`focus-ring w-full resize-none rounded border bg-[#0A090F] px-3.5 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.description
                ? 'border-red-500/70'
                : 'border-[#262626] hover:border-[#404040] focus:border-orange-500/70'
            }`}
          />
          {errors.description && (
            <p
              id="new-task-desc-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-red-400"
            >
              {errors.description}
            </p>
          )}
        </div>

        {/* Priority & Submit Row */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-neutral-400">
              Priority:
            </span>
            {PRIORITIES.map((item) => {
              const isSelected = priority === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={submitting}
                  onClick={() => setPriority(item.value)}
                  aria-pressed={isSelected}
                  className={`focus-ring btn-smooth min-h-[38px] rounded border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSelected
                      ? item.activeClass
                      : 'border-[#262626] bg-[#0A090F] text-neutral-400 hover:border-[#ff7300]/50 hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring btn-smooth btn-sweep group inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded border border-[#ff7300] bg-[#0A090F] px-5 py-2.5 text-sm font-semibold text-[#ff7300] shadow-[0_0_14px_rgba(255,115,0,0.18)] hover:bg-[#ff7300] hover:text-white hover:shadow-[0_0_22px_rgba(255,115,0,0.4)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                  aria-hidden="true"
                />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

