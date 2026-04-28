export default function HomeTopBar() {
  return (
    <div className="pointer-events-none">
      <a
        href="#"
        aria-label="Menu"
        className="home-brand-mark pointer-events-auto absolute left-[26px] top-[12px] inline-flex h-14 w-14 items-center justify-center text-[#111111]"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="30"
          viewBox="0 0 24 24"
          width="30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7H20M4 12H20M4 17H20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      </a>

      <a
        aria-label="Instagram"
        className="pointer-events-auto absolute right-[22px] top-[17px] inline-flex h-12 w-12 items-center justify-center text-[#111111]"
        href="https://www.instagram.com/"
        rel="noreferrer"
        target="_blank"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="28"
          viewBox="0 0 24 24"
          width="28"
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
