import { AlertTriangle, ClipboardList, Loader2, RefreshCw, SearchX } from 'lucide-react';
import { TaskItem } from './TaskItem';

export function TaskList({
  tasks,
  totalCount,
  loading,
  error,
  filter,
  searchQuery,
  pendingIds,
  onRetry,
  onResetFilters,
  onToggle,
  onEdit,
  onDeleteRequest,
}) {
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading tasks"
        className="flex h-full min-h-[220px] flex-col items-center justify-center rounded border border-[#262626] bg-[#0A090F]/50 px-6 py-10 text-center"
      >
        <Loader2
          className="h-8 w-8 animate-spin text-orange-500"
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-medium text-neutral-300">
          Loading your tasks...
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Syncing with the database
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex h-full min-h-[220px] flex-col items-center justify-center rounded border border-red-500/30 bg-red-500/5 px-6 py-10 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-white">
          Unable to load tasks
        </h2>
        <p className="mt-1 max-w-md text-xs text-neutral-400 sm:text-sm">
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring btn-smooth btn-sweep group mt-5 inline-flex min-h-[42px] items-center gap-2 rounded border border-[#ff7300] bg-[#0A090F] px-4 py-2 text-sm font-semibold text-[#ff7300] shadow-[0_0_14px_rgba(255,115,0,0.18)] hover:bg-[#ff7300] hover:text-white"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded border border-dashed border-[#262626] bg-[#0A090F]/50 px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded border border-orange-500/35 bg-orange-500/10 text-orange-400">
          <ClipboardList className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-white sm:text-lg">
          No tasks yet, add your first one
        </h2>
        <p className="mt-1 max-w-sm text-xs text-neutral-400 sm:text-sm">
          Create a task on the left to start tracking your goals and priorities.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    const hasSearch = searchQuery.trim().length > 0;
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded border border-dashed border-[#262626] bg-[#0A090F]/50 px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-[#262626] bg-[#262626] text-neutral-400">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-white">
          {hasSearch
            ? `No tasks match "${searchQuery.trim()}"`
            : `No ${filter} tasks`}
        </h2>
        <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
          Try clearing your search or switching back to all tasks.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="focus-ring btn-smooth mt-4 inline-flex min-h-[40px] items-center rounded border border-[#ff7300]/70 bg-[#0A090F] px-4 py-2 text-xs font-medium text-[#ff7300] hover:bg-[#ff7300] hover:text-white"
        >
          Show all tasks
        </button>
      </div>
    );
  }

  return (
    <section aria-label="Tasks" className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          isPending={pendingIds.has(task._id)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </section>
  );
}

