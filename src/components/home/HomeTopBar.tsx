type HomeTopBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function HomeTopBar({
  query,
  onQueryChange,
}: HomeTopBarProps) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-5 lg:flex-row lg:items-start">
      <a
        href="#"
        className="inline-flex max-w-fit items-center justify-center rounded-full border-2 border-white/50 bg-white/10 px-6 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-[4px]"
      >
        <span className="font-display text-[clamp(20px,2.2vw,38px)] leading-[0.9] uppercase tracking-[0.01em] text-[#111111]">
          Creative Coding NYC
        </span>
      </a>

      <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
        <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-black/10 bg-white/40 px-4 shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur-[10px] lg:min-w-[260px] lg:flex-none">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-black/60"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 20L17 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search posters, artists..."
            className="w-full border-0 bg-transparent text-[15px] font-medium text-[#111111] outline-none placeholder:text-black/45"
          />
        </label>

        <button className="home-navlink">Artists</button>
        <button className="home-navlink">About</button>
        <button className="home-pill-btn">Submit</button>
      </div>
    </div>
  );
}
