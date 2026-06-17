type HomeHeroProps = {
  count: number;
};

export default function HomeHero({ count }: HomeHeroProps) {
  return (
    <div className="max-w-[470px] pb-6 lg:pl-3">
      <div className="flex items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Poster Gallery"
          className="home-invert-art h-auto w-[min(430px,92vw)] max-w-full"
          src="./poster-gallery.svg"
          height={407}
          width={613}
        />
      </div>
      <p
        className="home-invert-text mt-[18px] text-[clamp(24px,2vw,28px)] font-medium"
        data-invert-text="from 20+ NYC artists"
      >
        from 20+ NYC artists
      </p>

      <p
        className="home-invert-text mt-[18px] text-[15px] font-medium opacity-70"
        data-invert-text={`20+ artists • ${count * 12} posters`}
      >
        120+ artists • {count * 12} posters
      </p>
    </div>
  );
}
