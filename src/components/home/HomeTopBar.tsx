"use client";

import { useEffect, useId, useState } from "react";

const aboutCopy =
  "Creative Coding NYC is a community organization that brings together artists, designers, developers, educators, and creative technologists through meetups, workshops, talks, and exhibitions. We are approaching our third anniversary and continue to grow a vibrant community centered around creativity, experimentation, and learning. We host meetups nearly every Tuesday at Pier 57 in Chelsea, often gathering in the Google classrooms, where community members share projects, exchange ideas, and explore new creative technologies together.";

export default function HomeTopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const drawerId = useId();

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="pointer-events-none">
      <button
        aria-controls={drawerId}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="home-brand-mark home-invert-icon pointer-events-auto absolute left-[22px] top-[8px] inline-flex h-16 w-16 items-center justify-center"
        onClick={() => {
          if (isMenuOpen) {
            closeMenu();
            return;
          }
          openMenu();
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="38"
          viewBox="0 0 24 24"
          width="38"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7H20M4 12H20M4 17H20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      <div
        aria-hidden={!isMenuOpen}
        className={`home-menu-backdrop pointer-events-auto ${isMenuOpen ? "is-open" : ""}`}
        onClick={closeMenu}
      />

      <aside
        aria-label="Site menu"
        className={`home-menu-drawer pointer-events-auto ${isMenuOpen ? "is-open" : ""}`}
        id={drawerId}
      >
        <div className="home-menu-header">
          <span>Creative Coding NYC</span>
          <button aria-label="Close menu" className="home-menu-close" onClick={closeMenu} type="button">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav aria-label="Main menu" className="home-menu-nav">
          <button
            aria-expanded={showAbout}
            className="home-menu-item"
            onClick={() => setShowAbout((current) => !current)}
            type="button"
          >
            About
          </button>
          <a className="home-menu-item" href="mailto:creativecodingnyc@gmail.com">
            Contact
          </a>
        </nav>

        <div className={`home-menu-about ${showAbout ? "is-visible" : ""}`}>
          <p>{aboutCopy}</p>
        </div>
      </aside>

      <a
        aria-label="Instagram"
        className="home-invert-icon pointer-events-auto absolute right-[18px] top-[11px] inline-flex h-14 w-14 items-center justify-center"
        href="https://instagram.com/creativecodingnyc"
        rel="noreferrer"
        target="_blank"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="34"
          viewBox="0 0 24 24"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            height="14"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
            width="14"
            x="5"
            y="5"
          />
          <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16.6" cy="7.4" fill="currentColor" r="1.1" />
        </svg>
      </a>

    </div>
  );
}
