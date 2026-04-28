import type { PosterRecord } from "./homeData";

type FeaturedPosterPanelProps = {
  posters: PosterRecord[];
  activePosterId: number | null;
  onActivePosterChange: (id: number) => void;
};

export default function FeaturedPosterPanel({
  posters,
  activePosterId,
  onActivePosterChange,
}: FeaturedPosterPanelProps) {
  return (
    <aside className="w-full min-w-0 max-w-[520px] lg:w-[min(360px,31vw)] lg:min-w-[280px] lg:max-w-none">
      <div className="mb-[14px] flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#111111]">
          Wall Guide
        </h3>
        <div className="text-[13px] font-bold text-black/66">
          {posters.length} results
        </div>
      </div>

      <div className="grid max-h-[32vh] grid-cols-2 gap-[14px] overflow-auto pr-0.5 lg:max-h-[48vh]">
        {posters.map((poster) => (
          <article
            key={poster.id}
            onMouseEnter={() => onActivePosterChange(poster.id)}
            onClick={() => onActivePosterChange(poster.id)}
            className={`group cursor-pointer transition duration-200 ${
              activePosterId === poster.id ? "scale-[1.03]" : "hover:scale-[1.02]"
            }`}
          >
            <div
              className={`aspect-[3/4] w-full overflow-hidden rounded-[14px] shadow-[0_14px_30px_rgba(0,0,0,0.16)] ring-1 ring-black/8 transition duration-200 ${
                activePosterId === poster.id
                  ? "shadow-[0_18px_36px_rgba(0,0,0,0.22)] ring-black/18"
                  : "group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.2)]"
              }`}
              style={{
                backgroundImage: `url(${poster.imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              aria-label={`${poster.title} by ${poster.artist}`}
            />
          </article>
        ))}
      </div>
    </aside>
  );
}
