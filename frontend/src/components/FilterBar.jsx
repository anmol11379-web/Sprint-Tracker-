import { Search, Trash2, X } from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export function FilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
  onClearCompletedRequest,
  submitting,
}) {
  const countMap = {
    all: counts.total,
    active: counts.active,
    completed: counts.completed,
  };

  return (
    <section
      aria-label="Filter and search tasks"
      className="flex shrink-0 flex-col gap-2.5 rounded border border-[#262626] bg-[#0A090F]/80 p-3"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Filter Tabs */}
        <div
          role="tablist"
          aria-label="Task status filter"
          className="grid w-full grid-cols-3 gap-1 rounded bg-[#0A090F] p-1 md:inline-flex md:w-auto md:gap-1.5"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onFilterChange(tab.id)}
                className={`focus-ring btn-smooth inline-flex min-h-[38px] items-center justify-center gap-1 rounded border px-1.5 py-1.5 text-[11px] font-medium sm:gap-1.5 sm:px-3 sm:text-sm ${
                  isActive
                    ? 'border-[#ff7300] bg-[#ff7300]/15 text-[#ff7300] shadow-[0_0_12px_rgba(255,115,0,0.18)]'
                    : 'border-transparent text-neutral-400 hover:border-[#ff7300]/40 hover:bg-[#171717] hover:text-[#ff7300]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                    isActive
                      ? 'bg-[#ff7300]/20 text-[#ff7300]'
                      : 'bg-[#262626] text-neutral-400'
                  }`}
                >
                  {countMap[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 md:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="focus-ring min-h-[40px] w-full rounded border border-[#262626] bg-[#0A090F] pl-9 pr-9 text-sm text-white placeholder-neutral-500 transition-colors hover:border-[#404040] focus:border-orange-500/70"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="focus-ring absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-neutral-400 hover:bg-[#262626] hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Counter & Clear Completed */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#262626] pt-3 text-xs">
        <p className="font-medium text-neutral-400">
          <span className="font-semibold text-white">{counts.active}</span>{' '}
          {counts.active === 1 ? 'task' : 'tasks'} left
        </p>

        {counts.completed > 0 && (
          <button
            type="button"
            disabled={submitting}
            onClick={onClearCompletedRequest}
            className="focus-ring btn-smooth inline-flex min-h-[34px] items-center gap-1.5 rounded border border-red-500/35 bg-[#0A090F] px-2.5 py-1 font-medium text-red-400 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear completed ({counts.completed})</span>
          </button>
        )}
      </div>
    </section>
  );
}

