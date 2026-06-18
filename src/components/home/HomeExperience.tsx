"use client";

import HomeHero from "./HomeHero";
import HomeInvertMask from "./HomeInvertMask";
import HomeScene from "./HomeScene";
import HomeTopBar from "./HomeTopBar";
import { posters } from "./homeData";

export default function HomeExperience() {
  const activePosterId = posters[0]?.id ?? null;
  const featuredPosters = posters.slice(0, 4);

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
