"use client";

import { useEffect, useMemo, useState } from "react";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // Prefer env var if present; fallback to a hardcoded code so your build still works
  const PASSWORD = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_GALLERY_PASSWORD;
    return (env && env.trim().length > 0 ? env : "ccnyc2026").trim();
  }, []);

  useEffect(() => {
    const restore = window.requestAnimationFrame(() => {
      try {
        if (sessionStorage.getItem("unlocked") === "true") {
          setUnlocked(true);
        }
      } catch {
        // sessionStorage can be blocked in some contexts; ignore
      }
    });

    return () => window.cancelAnimationFrame(restore);
  }, []);

  function unlock() {
    setUnlocked(true);
    setError(false);
    try {
      sessionStorage.setItem("unlocked", "true");
    } catch {
      // ignore if storage unavailable
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // <-- this prevents the Enter key from navigating (no 404)

    const typed = input.trim().toLowerCase();
    const expected = PASSWORD.trim().toLowerCase();

    if (typed === expected) {
      unlock();
    } else {
      setError(true);
      setInput("");
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0b0b",
        color: "white",
        fontFamily: "sans-serif",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 40,
          borderRadius: 24,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          minWidth: 320,
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            CCNYC Virtual Showcase
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Please enter the access code to continue.
          </p>

          {/* Optional: tiny hint if env var is missing (remove if you want) */}
          {/* <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
            Using: {process.env.NEXT_PUBLIC_GALLERY_PASSWORD ? "env password" : "fallback password"}
          </p> */}
        </div>

        <input
          type="password"
          placeholder="Enter password"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(false);
          }}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            outline: "none",
            fontSize: 16,
          }}
        />

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "white",
            color: "black",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 16,
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Enter
        </button>

        {error && (
          <span style={{ color: "#ff6b6b", fontSize: 13, fontWeight: 500 }}>
            Incorrect password. Try again.
          </span>
        )}
      </form>
    </div>
  );
}
