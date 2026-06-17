"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const CARDS = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  angle: index * 26,
  radius: 92 + (index % 5) * 18,
  delay: index * -0.42,
  duration: 7.9 + (index % 4) * 0.75,
  seed: `ccnyc-spiral-${index + 1}`,
  driftX: (index % 3) * 14 - 14,
  driftY: (index % 4) * 11 - 18,
  rotate: (index % 5) * 8 - 16,
}));

const STRIP_COUNT = 15;
const STRIPS = Array.from({ length: STRIP_COUNT }, (_, stripIndex) => {
  const centerOffset = stripIndex - (STRIP_COUNT - 1) / 2;
  const edgeDistance = Math.abs(centerOffset);

  return {
    index: stripIndex,
    offset: `${(stripIndex / (STRIP_COUNT - 1)) * 100}%`,
    centerOffset,
    edgeDistance,
  };
});

export default function SpiralPreloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const finish = window.setTimeout(() => setHidden(true), 3800);
    return () => window.clearTimeout(finish);
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`spiral-loader${hidden ? " spiral-loader--hidden" : ""}`}
    >
      <div className="spiral-loader__veil" />
      <div className="spiral-loader__core">
        <p className="spiral-loader__eyebrow">CCNYC Virtual Showcase</p>
        <h1 className="spiral-loader__title">Quietly Descending</h1>
        <p className="spiral-loader__caption">
          drifting fragments, gathering into view
        </p>
      </div>

      <div className="spiral-loader__scene">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className="spiral-card"
            style={
              {
                "--angle": `${card.angle}deg`,
                "--radius": `${card.radius}px`,
                "--delay": `${card.delay}s`,
                "--duration": `${card.duration}s`,
                "--drift-x": `${card.driftX}px`,
                "--drift-y": `${card.driftY}px`,
                "--rotation": `${card.rotate}deg`,
                backgroundImage: `url(https://picsum.photos/seed/${card.seed}/320/420)`,
              } as CSSProperties
            }
          >
            <div className="spiral-card__surface">
              {STRIPS.map((strip) => (
                <div
                  key={strip.index}
                  className="spiral-card__strip"
                  style={
                    {
                      "--strip-index": strip.index,
                      "--strip-offset": strip.offset,
                      "--strip-center-offset": `${strip.centerOffset}`,
                      "--strip-edge-distance": `${strip.edgeDistance}`,
                    } as CSSProperties
                  }
                >
                  <div className="spiral-card__strip-image" />
                  <div className="spiral-card__gloss" />
                  <div className="spiral-card__shade" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
