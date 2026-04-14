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
      <div className="rounded-[24px] border border-white/35 bg-white/24 p-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-[12px]">
        <div className="mb-[14px] flex items-center justify-between gap-3">
          <h3 className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#111111]">
            Featured This Week
          </h3>
          <div className="text-[13px] font-bold text-black/66">
            {posters.length} results
          </div>
        </div>

        <div className="grid max-h-[32vh] grid-cols-1 gap-[14px] overflow-auto pr-0.5 lg:max-h-[48vh] lg:grid-cols-2">
          {posters.map((poster) => (
            <article
              key={poster.id}
              onMouseEnter={() => onActivePosterChange(poster.id)}
              onClick={() => onActivePosterChange(poster.id)}
              className={`grid cursor-pointer grid-cols-[82px_1fr] gap-3 rounded-[18px] border border-black/6 bg-white/42 p-[10px] transition duration-200 hover:-translate-y-0.5 hover:border-black/12 hover:bg-white/72 ${
                activePosterId === poster.id
                  ? "-translate-y-0.5 border-black/12 bg-white/72"
                  : ""
              }`}
            >
              <div
                className="h-[112px] w-[82px] rounded-[10px] shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundImage: `url(${poster.imageUrl})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
              <div className="min-w-0">
                <p className="my-0.5 text-[15px] font-extrabold text-[#111111]">
                  {poster.title}
                </p>
                <p className="m-0 text-[13px] font-medium leading-[1.35] text-black/66">
                  {poster.artist}
                </p>
                <p className="m-0 text-[13px] font-medium leading-[1.35] text-black/66">
                  {poster.tag}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
