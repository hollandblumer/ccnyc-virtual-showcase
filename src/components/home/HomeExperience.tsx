"use client";

import { useMemo, useState } from "react";

import HomeHero from "./HomeHero";
import HomeInvertMask from "./HomeInvertMask";
import HomeScene from "./HomeScene";
import HomeTopBar from "./HomeTopBar";
import { posters } from "./homeData";

export default function HomeExperience() {
  const [query, setQuery] = useState("");
  const [activePosterId] = useState<number | null>(posters[0]?.id ?? null);

  const filteredPosters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return posters;

    return posters.filter((poster) =>
      [poster.title, poster.artist, poster.tag].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [query]);

  const visiblePosters = filteredPosters.length ? filteredPosters : posters;
  const visibleActivePosterId = visiblePosters.some(
    (poster) => poster.id === activePosterId,
  )
    ? activePosterId
    : (visiblePosters[0]?.id ?? null);
  const featuredPosters = visiblePosters.slice(0, 4);

  return (
    <main className="home-shell">
      <HomeInvertMask />
      <HomeScene posters={visiblePosters} activePosterId={visibleActivePosterId} />
      <div className="home-loading-label" aria-hidden="true">
        <span className="home-loading-brand">Creative Coding NYC</span>
        <span>Loading...</span>
      </div>
      <div className="home-atmosphere" aria-hidden="true" />

      <div className="home-ui">
        <HomeTopBar />

        <div className="flex min-h-[56vh] flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
          <HomeHero count={filteredPosters.length || posters.length} />
          <section className="home-featured-panel" aria-label="Featured this week">
            <h2 className="home-invert-text" data-invert-text="Featured this week">
              Featured this week
            </h2>
            <div className="home-featured-grid">
              {featuredPosters.map((poster) => (
                <article className="home-featured-poster" key={poster.id}>
                  <div
                    aria-label={`${poster.title} by ${poster.artist}`}
                    className="home-featured-poster-image"
                    role="img"
                    style={{ backgroundImage: `url(${poster.imageUrl})` }}
                  />
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-end justify-between gap-5">
          <div
            className="home-invert-text text-[14px] font-medium lowercase tracking-[0.08em] opacity-75"
            data-invert-text="scroll to discover ↓"
          >
            scroll to discover ↓
          </div>
          <button className="home-view-all" onClick={() => setQuery("")}>
            View All
          </button>
        </div>
      </div>
    </main>
  );
}
