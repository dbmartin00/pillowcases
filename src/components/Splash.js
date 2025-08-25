import { useEffect, useRef } from "react";
import "./Splash.css";

export default function Splash({ onStart }) {
  const rootRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    root.style.touchAction = "pan-y"; // allow vertical scrolling, block horizontal interference

    const onPointerDown = (e) => {
      startPos.current = {
        x: e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0,
        y: e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0,
        active: true,
      };
    };

    const onPointerUp = (e) => {
      if (!startPos.current.active) return;
      const endX = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX) ?? 0;
      const endY = e.clientY ?? (e.changedTouches && e.changedTouches[0]?.clientY) ?? 0;

      const dx = endX - startPos.current.x;
      const dy = endY - startPos.current.y;

      // Require a mostly-horizontal LEFT swipe (dx < -60)
      if (dx < -60 && Math.abs(dy) < 40) {
        onStart?.();
      }

      startPos.current.active = false;
    };

    root.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    root.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });

    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "Enter" || e.key === " ") {
        onStart?.();
      }
    };
    root.addEventListener("keydown", onKey);

    return () => {
      root.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      root.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchend", onPointerUp);
      root.removeEventListener("keydown", onKey);
    };
  }, [onStart]);

  return (
    <div
      className="splash"
      ref={rootRef}
      tabIndex={0}
      aria-label="Splash screen. Swipe left or press Enter to begin."
    >
      <div className="splash-card">
        <h1>Welcome to David&apos;s Pillow Emporium!</h1>
        <p>Text me the names of the pillow cases you want. Inventory is limited.</p>
        <ul className="bullets">
          <li>The pillowcase body and cuff are cotton.</li>
          <li>Some accent fabric is a mix.</li>
          <li>To wash, turn inside-out and wash on delicates.</li>
          <li>Tumble dry or at low heat. Iron on low heat.</li>
        </ul>

        <button className="primary" onClick={onStart}>
          Begin <span className="arrow">←</span>
        </button>

        <div className="swipe-hint">
          Swipe left <span className="arrow bounce">←</span>
        </div>
      </div>
    </div>
  );
}

