import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const IMG_BASE = "/pillowcase_images";
const JSON_URL = "/pillowcases.json"; // lives in /public

export default function Viewer() {
  const [fabrics, setFabrics] = useState(null);
  const [error, setError] = useState(null);

  // Load fabrics from public/pillowcases.json
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(JSON_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setFabrics(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load pillowcases.json");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build slides: intro (index 0) + fabrics from JSON
  const slides = useMemo(() => {
    const intro = {
      type: "intro",
      src: `${IMG_BASE}/pillowcase_anatomy.jpg`,
      alt: "Pillowcase anatomy diagram",
    };
    if (!fabrics || !Array.isArray(fabrics)) return [intro];
    const fabricSlides = fabrics.map((f) => ({
      type: "fabric",
      src: `${IMG_BASE}/${f.filename}`,
      name: f.name,
      quantity: f.quantity,
    }));
    return [intro, ...fabricSlides];
  }, [fabrics]);

  const [index, setIndex] = useState(0);
  const maxIndex = slides.length - 1;

  const goNext = useCallback(() => setIndex((i) => Math.min(i + 1, maxIndex)), [maxIndex]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // Touch/drag to swipe
  const startX = useRef(null);
  const threshold = 40;

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => {
    if (startX.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx > threshold) { goPrev(); startX.current = null; }
    if (dx < -threshold) { goNext(); startX.current = null; }
  };
  const onTouchEnd = () => { startX.current = null; };

  // Keyboard arrows for desktop
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
      <div className="viewer error">
        <p>Couldn’t load fabrics: {error}</p>
      </div>
    );
  }

  if (!fabrics) {
    return (
      <div className="viewer loading">
        <p>Loading fabrics…</p>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div
      className="viewer"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <img
        className="viewer-image"
        src={slide.src}
        alt={slide.alt || slide.name || "pillowcase"}
        draggable="false"
      />

      {/* Bottom overlay stays on-screen */}
      <div className="bottom-overlay">
        {slide.type === "intro" ? (
          <div className="intro-copy">
            <h2>Pillowcase Anatomy</h2>
            <p>(Add your notes here later.)</p>
            <div className="swipe-hint">
              Swipe <span className="arrow">→</span> to see fabrics
            </div>
          </div>
        ) : (
          <div className="fabric-meta">
            <div className="name">{slide.name}</div>
            {/* If you want to show quantity, uncomment: */}
            {/* <div className="qty">Qty: {slide.quantity}</div> */}
            <div className="swipe-hint subtle">
              Swipe <span className="arrow">←</span>/<span className="arrow">→</span> for more
            </div>
          </div>
        )}
      </div>

      {/* Click areas for desktop users */}
      <button className="nav left" onClick={goPrev} aria-label="Previous">‹</button>
      <button className="nav right" onClick={goNext} aria-label="Next">›</button>

      {/* Index indicator (doesn’t count intro as a fabric) */}
      <div className="index-indicator">
        {index === 0 ? "Intro" : `Fabric ${index} of ${slides.length - 1}`}
      </div>
    </div>
  );
}

