"use client";

import { useMemo, useState } from "react";

import HomeHero from "./HomeHero";
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

  return (
    <main className="home-shell">
      <HomeScene posters={visiblePosters} activePosterId={visibleActivePosterId} />
      <div className="home-loading-label" aria-hidden="true">
        Loading...
      </div>
      <div className="home-atmosphere" aria-hidden="true" />

      <div className="home-ui">
        <HomeTopBar />

        <div className="flex min-h-[56vh] flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
          <HomeHero count={filteredPosters.length || posters.length} />
        </div>

        <div className="flex items-end justify-between gap-5">
          <div className="text-[14px] font-medium lowercase tracking-[0.08em] text-black/75">
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
