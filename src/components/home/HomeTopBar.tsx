export default function HomeTopBar() {
  return (
    <div className="pointer-events-none">
      <a
        href="#"
        aria-label="Menu"
        className="home-brand-mark home-invert-icon pointer-events-auto absolute left-[22px] top-[8px] inline-flex h-16 w-16 items-center justify-center"
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
      </a>

      <a
        aria-label="LinkedIn"
        className="home-invert-icon pointer-events-auto absolute right-[82px] top-[11px] inline-flex h-14 w-14 items-center justify-center"
        href="https://www.linkedin.com/"
        rel="noreferrer"
        target="_blank"
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="34"
          viewBox="0 0 24 24"
          width="34"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.94 8.86H3.76V19h3.18V8.86ZM5.35 7.48c1.02 0 1.85-.82 1.85-1.83s-.83-1.83-1.85-1.83S3.5 4.64 3.5 5.65s.83 1.83 1.85 1.83ZM20.5 13.44c0-3.05-1.63-4.47-3.8-4.47-1.75 0-2.53.96-2.97 1.64V8.86h-3.05c.04.97 0 10.14 0 10.14h3.18v-5.66c0-.3.02-.61.11-.82.23-.61.76-1.24 1.65-1.24 1.16 0 1.63.89 1.63 2.19V19h3.18l.07-5.56Z" />
        </svg>
      </a>

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
