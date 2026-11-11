import { Check, Clock, Pencil, Trash2 } from 'lucide-react';

const PRIORITY_STYLES = {
  high: {
    badge: 'border-orange-500/40 bg-orange-500/15 text-orange-300',
    dot: 'bg-orange-500',
    label: 'High',
  },
  medium: {
    badge: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
    dot: 'bg-amber-400',
    label: 'Medium',
  },
  low: {
    badge: 'border-[#3DDC84]/35 bg-[#3DDC84]/10 text-[#3DDC84]',
    dot: 'bg-[#3DDC84]',
    label: 'Low',
  },
};

function formatTimestamp(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function TaskItem({ task, isPending, onToggle, onEdit, onDeleteRequest }) {
  const priorityInfo = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  return (
    <article
      className={`animate-task-enter card-smooth group relative flex flex-col gap-3 rounded border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-4 ${
        task.completed
          ? 'border-[#3DDC84]/30 bg-[#0f1712]/80 hover:border-[#3DDC84]/50'
          : 'border-[#262626] bg-[#171717]/95 hover:border-orange-500/50 hover:bg-[#1c1c1c]'
      } ${isPending ? 'opacity-70' : 'opacity-100'}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Touch-friendly completion toggle */}
        <button
          type="button"
          onClick={() => onToggle(task._id)}
          disabled={isPending}
          aria-label={
            task.completed
              ? `Mark "${task.title}" as incomplete`
              : `Mark "${task.title}" as complete`
          }
          aria-pressed={task.completed}
          className="focus-ring -ml-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded transition-transform active:scale-95 disabled:cursor-not-allowed"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-all duration-200 ${
              task.completed
                ? 'border-[#3DDC84] bg-[#3DDC84] text-[#0A090F] shadow-md shadow-[#3DDC84]/25'
                : 'border-neutral-600 bg-[#0A090F] text-transparent group-hover:border-orange-500'
            }`}
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
          </span>
        </button>

        {/* Task Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`break-words text-sm font-semibold leading-snug transition-colors sm:text-base ${
                task.completed ? 'text-neutral-500 line-through' : 'text-white'
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium ${
                task.completed
                  ? 'border-neutral-700/60 bg-neutral-800/50 text-neutral-500'
                  : priorityInfo.badge
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  task.completed ? 'bg-neutral-500' : priorityInfo.dot
                }`}
                aria-hidden="true"
              />
              {priorityInfo.label}
            </span>
          </div>

          {task.description && (
            <p
              className={`mt-1.5 whitespace-pre-wrap break-words text-xs leading-relaxed sm:text-sm ${
                task.completed
                  ? 'text-neutral-600 line-through'
                  : 'text-neutral-400'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatTimestamp(task.createdAt)}
            </span>
            {task.completed && (
              <span className="font-medium text-[#3DDC84]/90">Completed</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5 border-t border-[#262626] pt-2 sm:border-t-0 sm:pt-0">
        <button
          type="button"
          onClick={() => onEdit(task)}
          disabled={isPending}
          aria-label={`Edit "${task.title}"`}
          className="focus-ring btn-smooth inline-flex min-h-[42px] min-w-[42px] items-center justify-center gap-1.5 rounded border border-transparent px-2.5 text-xs font-medium text-neutral-400 hover:border-[#ff7300]/50 hover:bg-[#0A090F] hover:text-[#ff7300] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[36px] sm:min-w-[36px] sm:px-2"
        >
          <Pencil className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" aria-hidden="true" />
          <span className="sm:hidden">Edit</span>
        </button>

        <button
          type="button"
          onClick={() => onDeleteRequest(task)}
          disabled={isPending}
          aria-label={`Delete "${task.title}"`}
          className="focus-ring btn-smooth inline-flex min-h-[42px] min-w-[42px] items-center justify-center gap-1.5 rounded border border-transparent px-2.5 text-xs font-medium text-neutral-400 hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[36px] sm:min-w-[36px] sm:px-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">Delete</span>
        </button>
      </div>
    </article>
  );
}

