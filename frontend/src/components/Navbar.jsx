export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-500/35 bg-[#0A090F]/85 backdrop-blur-md">
      <nav
        aria-label="Android Club primary navigation"
        className="flex h-14 w-full items-center justify-between px-4 sm:px-8"
      >
        {/* Left: Official Android Club Logo */}
        <a
          href="#top"
          className="focus-ring group flex items-center gap-2 rounded py-1 pr-2 transition-opacity duration-200 hover:opacity-90"
        >
          <img
            src="/Logo.png"
            alt="Android Club Logo"
            className="h-7 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-8"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-white sm:text-base">
              Android Club
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-neutral-400">
              VIT Bhopal
            </span>
          </div>
        </a>

        {/* Right: Signature 4-dot square reticle from androidclub.tech */}
        <div className="flex h-full shrink-0 items-center border-l border-neutral-500/35 pl-3 sm:pl-6">
          <div className="group flex cursor-default items-center gap-2">
            <div className="square-container" aria-hidden="true">
              <div className="dot-line left-0 top-0 h-1.5 w-1.5" />
              <div className="dot-line right-0 top-0 h-1.5 w-1.5" />
              <div className="dot-line bottom-0 right-0 h-1.5 w-1.5" />
              <div className="dot-line bottom-0 left-0 h-1.5 w-1.5" />
            </div>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-200 transition-colors group-hover:text-[#3DDC84] sm:inline">
              Task Console
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
