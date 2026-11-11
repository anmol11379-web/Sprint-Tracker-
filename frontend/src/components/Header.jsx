import { CheckCircle2, Layers } from 'lucide-react';

const CIRCLE_RADIUS = 24;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export function Header({ totalCount, activeCount, completedCount }) {
  const completionPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const strokeDashoffset =
    CIRCLE_CIRCUMFERENCE - (completionPct / 100) * CIRCLE_CIRCUMFERENCE;

  return (
    <header className="space-y-3.5">
      <div>
        {/* 2-dot cyber eyebrow indicator from androidclub.tech */}
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          <div className="flex gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3DDC84]" />
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          </div>
          <span>Sprint Tracker</span>
        </div>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Club{' '}
          <span className="bg-gradient-to-r from-[#ff7300] to-[#f2ff00] bg-clip-text text-transparent">
            Task
          </span>{' '}
          List
        </h1>
        <p className="mt-0.5 text-xs text-neutral-400">
          Organize Android Club deliverables and track sprint progress.
        </p>
      </div>

      {/* Chamfered stats card with SVG Percentage Circle */}
      <div className="relative rounded border border-[#262626] bg-[#171717]/95 px-4 py-3 shadow-xl shadow-black/40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[2px] w-[88%] bg-gradient-to-r from-[#f2ff00] to-[#ff7300]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-[88%] bg-gradient-to-r from-[#f2ff00] to-[#ff7300]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[55%] w-[2px] bg-gradient-to-t from-[#f2ff00] to-[#ff7300]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[55%] w-[2px] bg-gradient-to-t from-[#f2ff00] to-[#ff7300]"
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Circular Percentage Ring */}
          <div className="flex items-center gap-3.5">
            <div
              className="relative flex h-16 w-16 shrink-0 items-center justify-center"
              role="progressbar"
              aria-valuenow={completionPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task completion percentage"
            >
              <svg
                className="h-16 w-16 -rotate-90"
                viewBox="0 0 60 60"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="clubRingGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ff7300" />
                    <stop offset="50%" stopColor="#f2ff00" />
                    <stop offset="100%" stopColor="#3DDC84" />
                  </linearGradient>
                </defs>
                <circle
                  cx="30"
                  cy="30"
                  r={CIRCLE_RADIUS}
                  fill="none"
                  stroke="#262626"
                  strokeWidth="5"
                />
                <circle
                  cx="30"
                  cy="30"
                  r={CIRCLE_RADIUS}
                  fill="none"
                  stroke="url(#clubRingGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-[stroke-dashoffset] duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-bold tabular-nums text-[#3DDC84]">
                {completionPct}%
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-white">Task completion</p>
              <p className="mt-0.5 text-[11px] text-neutral-400">
                {totalCount === 0
                  ? 'No tasks yet'
                  : `${completedCount} of ${totalCount} completed`}
              </p>
            </div>
          </div>

          {/* Active & Done Counters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-orange-400" aria-hidden="true" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Active
                </p>
                <p className="text-sm font-semibold text-white">
                  {activeCount} {activeCount === 1 ? 'task' : 'tasks'}
                </p>
              </div>
            </div>

            <div className="h-7 w-px bg-neutral-700/70" aria-hidden="true" />

            <div className="flex items-center gap-2">
              <CheckCircle2
                className="h-4 w-4 text-[#3DDC84]"
                aria-hidden="true"
              />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Done
                </p>
                <p className="text-sm font-semibold text-[#3DDC84]">
                  {completedCount}/{totalCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
