import { artistDots } from "./homeData";

type HomeHeroProps = {
  count: number;
};

export default function HomeHero({ count }: HomeHeroProps) {
  return (
    <div className="max-w-[470px] pb-6 lg:pl-3">
      <h1 className="font-display text-[clamp(64px,8vw,126px)] leading-[0.88] uppercase tracking-[0.01em] text-[var(--home-accent)] [text-shadow:0_6px_18px_rgba(0,0,0,0.12)]">
        Explore
        <br />
        Posters
      </h1>
      <p className="mt-[18px] text-[clamp(24px,2vw,28px)] font-medium text-[#111111]">
        from 120+ NYC artists
      </p>

      <div className="mt-[22px] flex flex-wrap items-center gap-3">
        <button className="home-cta">Explore Posters -&gt;</button>
      </div>

      <div className="mt-[18px] flex items-center gap-2">
        {artistDots.map((url, index) => (
          <div
            key={url}
            className={`h-[34px] w-[34px] rounded-full border-2 border-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] bg-cover bg-center ${
              index === 0 ? "" : "-ml-2"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>

      <p className="mt-[18px] text-[15px] font-medium text-black/65">
        120+ artists • {count * 12} posters
      </p>
    </div>
  );
}
