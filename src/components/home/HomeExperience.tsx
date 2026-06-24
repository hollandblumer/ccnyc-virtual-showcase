"use client";

import { useEffect, useMemo, useState } from "react";

import HomeHero from "./HomeHero";
import HomeInvertMask from "./HomeInvertMask";
import HomeScene from "./HomeScene";
import HomeTopBar from "./HomeTopBar";
import { posters, type PosterRecord } from "./homeData";

type FeaturedPostersResponse = {
  featuredWeekStart: string;
  posters: Array<{
    id: number;
    title: string;
    artist: string;
    tag: string;
  }>;
};

export default function HomeExperience() {
  const [featuredPosterIds, setFeaturedPosterIds] = useState<number[]>(
    posters.slice(0, 4).map((poster) => poster.id),
  );
  const activePosterId = featuredPosterIds[0] ?? posters[0]?.id ?? null;
  const featuredPosters = useMemo(() => {
    const sqlFeaturedPosters = featuredPosterIds
      .map((id) => posters.find((poster) => poster.id === id))
      .filter((poster): poster is PosterRecord => Boolean(poster));

    return sqlFeaturedPosters.length > 0
      ? sqlFeaturedPosters
      : posters.slice(0, 4);
  }, [featuredPosterIds]);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedPosters() {
      try {
        const response = await fetch("/api/featured-posters", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Featured posters request failed.");
        }

        const featuredResponse = (await response.json()) as FeaturedPostersResponse;
        const ids = featuredResponse.posters.map((poster) => poster.id);

        if (isMounted) {
          setFeaturedPosterIds(ids);
        }
      } catch (error) {
        console.warn(error);
      }
    }

    loadFeaturedPosters();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="home-shell">
      <section className="home-stage" aria-label="Poster gallery introduction">
        <HomeInvertMask />
        <HomeScene posters={posters} activePosterId={activePosterId} />
        <div className="home-loading-label" aria-hidden="true">
          <span className="home-loading-brand">Creative Coding NYC</span>
          <span>Loading...</span>
        </div>
        <div className="home-atmosphere" aria-hidden="true" />

        <div className="home-ui">
          <HomeTopBar />
          <div className="flex min-h-[56vh] flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
            <HomeHero />
            <section className="home-featured-panel" aria-label="Featured this week">
              <h2 className="home-invert-text" data-invert-text="Featured this week">
                Featured this week
              </h2>
              <div className="home-featured-grid">
                {featuredPosters.map((poster, index) => (
                  <article className="home-featured-poster" key={`${poster.id}-${index}`}>
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

          <div
            className="home-invert-text text-[14px] font-medium lowercase tracking-[0.08em] opacity-75"
            data-invert-text="scroll to discover ↓"
          >
            scroll to discover ↓
          </div>
        </div>
      </section>

      <section className="home-poster-gallery" aria-label="Poster gallery">
        <div className="home-poster-grid">
          {posters.map((poster, index) => (
            <article className="home-poster-card" key={`${poster.id}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`${poster.title} by ${poster.artist}`}
                className="home-poster-card-image"
                src={poster.imageUrl}
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
