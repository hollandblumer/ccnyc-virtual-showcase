export default function HomeHero() {
  return (
    <div className="home-hero-copy max-w-[470px] pb-6 lg:pl-3">
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
    </div>
  );
}
