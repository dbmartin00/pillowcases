import { useEffect, useState, useCallback, useRef } from "react";
import Splash from "./components/Splash";
import Viewer from "./components/Viewer";
import "./index.css";

const IMG_BASE = "/pillowcase_images";
const JSON_URL = "/pillowcases.json";

/** Intro page (index === 0) with INLINE STYLES to override CSS issues */
function Intro({ onNext, onPrev }) {
  const startX = useRef(null);
  const threshold = 40;

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => {
    if (startX.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx > threshold) { onPrev(); startX.current = null; }
    if (dx < -threshold) { onNext(); startX.current = null; }
  };
  const onTouchEnd = () => { startX.current = null; };

  return (
    <div
      className="viewer"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <img
        className="viewer-image"
        src={`${IMG_BASE}/pillowcase_anatomy.jpg`}
        alt="Pillowcase anatomy diagram"
        draggable="false"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Inline-styled overlay so it ALWAYS shows */}
      <div
        className="bottom-overlay"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "14px 16px",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          zIndex: 9999,                 // <- on top of everything
          minHeight: 130,               // room for ~3 rows + hint
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 40%, rgba(0,0,0,.85) 100%)",
        }}
      >
        <div
          className="intro-copy"
          style={{ maxWidth: 820, width: "100%", textAlign: "center" }}
        >
          <h2 style={{ margin: "0 0 8px 0" }}>Pillowcase Anatomy</h2>

          <div
            className="coaching"
            style={{
              margin: "0 auto 10px auto",
              maxWidth: "90%",
              fontSize: 15,
              lineHeight: 1.4,
            }}
          >
            <p style={{ margin: "4px 0" }}>
              All pillowcases have a cuff and body, only a few have no accent.
            </p>
            <p style={{ margin: "4px 0" }}>
              Pillowcases are usually all cotton, and can shrink and wrikle in the wash.
            </p>
            <p style={{ margin: "4px 0" }}>
             Wash inside-out on delicate. Dry low heat or tumble dry. Iron low to medum.
            </p>
          </div>

          <div
            className="swipe-hint"
            style={{ fontWeight: 600, letterSpacing: ".2px" }}
          >
            Swipe <span style={{ display: "inline-block" }}>→</span> to see fabrics
          </div>
        </div>
      </div>

      {/* Desktop click areas */}
      <button
        className="nav left"
        onClick={onPrev}
        aria-label="Back"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: 10,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "none",
          background: "rgba(255,255,255,.15)",
          color: "#fff",
          fontSize: 28,
          lineHeight: "44px",
          cursor: "pointer",
          zIndex: 10000,
        }}
      >
        ‹
      </button>
      <button
        className="nav right"
        onClick={onNext}
        aria-label="Next"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: 10,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "none",
          background: "rgba(255,255,255,.15)",
          color: "#fff",
          fontSize: 28,
          lineHeight: "44px",
          cursor: "pointer",
          zIndex: 10000,
        }}
      >
        ›
      </button>

      {/* Index indicator */}
      <div
        className="index-indicator"
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          background: "rgba(0,0,0,.45)",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 999,
          fontSize: 12,
          zIndex: 10000,
        }}
      >
        Intro
      </div>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  // idx: -1 = Splash, 0 = Intro, 1..N = fabrics (items[idx-1])
  const [idx, setIdx] = useState(-1);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(JSON_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Could not load pillowcases.json. Make sure it’s in /public.");
        console.error(e);
      }
    }
    load();
  }, []);

  const goNext = useCallback(() => {
    setIdx((prev) => {
      // -1 (Splash) → 0 (Intro) → 1..N (Fabrics)
      const max = items.length; // intro + fabrics count
      if (prev < max) return prev + 1;
      return prev;
    });
  }, [items.length]);

  const goPrev = useCallback(() => {
    setIdx((prev) => {
      // Allow going back from Intro (0) to Splash (-1)
      if (prev > -1) return prev - 1;
      return prev;
    });
  }, []);

  // Keyboard left/right
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (error) {
    return (
      <div className="app-root center">
        <div className="error">{error}</div>
      </div>
    );
  }

  // Splash
  if (idx === -1) {
    return <Splash onStart={goNext} />;
  }

  // Intro (anatomy) page
  if (idx === 0) {
    return <Intro onNext={goNext} onPrev={goPrev} />;
  }

  // Fabrics (idx 1..N maps to items[idx-1])
  const item = items[idx - 1];
  return (
    <Viewer
      item={item}
      index={idx}           // starts at 1 for first fabric
      total={items.length}  // number of fabrics (intro not counted)
      onNext={goNext}
      onPrev={goPrev}
    />
  );
}

