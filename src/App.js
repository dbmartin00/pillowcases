import { useEffect, useState, useCallback } from "react";
import Splash from "./components/Splash";
import Viewer from "./components/Viewer";
import "./index.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(-1); // -1 = splash, 0..n = images
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/pillowcases.json", { cache: "no-store" });
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
      if (prev < 0) return 0; // from splash to first
      if (prev < items.length - 1) return prev + 1;
      return prev; // at end
    });
  }, [items.length]);

  const goPrev = useCallback(() => {
    setIdx((prev) => (prev > 0 ? prev - 1 : prev));
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

  if (idx === -1) {
    return <Splash onStart={goNext} />;
  }

  const item = items[idx];
  return (
    <Viewer
      item={item}
      index={idx}
      total={items.length}
      onNext={goNext}
      onPrev={goPrev}
    />
  );
}

