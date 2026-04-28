import Image from "next/image";

type HomeHeroProps = {
  count: number;
};

export default function HomeHero({ count }: HomeHeroProps) {
  return (
    <div className="max-w-[470px] pb-6 lg:pl-3">
      <div className="flex items-start">
        <Image
          alt="Poster Gallery"
          className="h-auto w-[min(430px,92vw)] max-w-full"
          src="/poster-gallery.svg"
          height={407}
          priority
          width={613}
        />
      </div>
      <p className="mt-[18px] text-[clamp(24px,2vw,28px)] font-medium text-[#111111]">
        from 120+ NYC artists
      </p>

      <p className="mt-[18px] text-[15px] font-medium text-black/65">
        120+ artists • {count * 12} posters
      </p>
    </div>
  );
}
