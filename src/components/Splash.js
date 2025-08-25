import { useEffect } from "react";

export default function Splash({ onStart }) {
  useEffect(() => {
    const handleSwipe = (e) => {
      if (e.type === "touchend") {
        const touch = e.changedTouches[0];
        const diffX = touch.clientX - startX;
        if (diffX > 50) {
          onStart(); // swipe right
        }
      }
    };

    let startX = 0;
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleSwipe);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleSwipe);
    };
  }, [onStart]);

  return (
    <div className="splash">
      <div className="splash-card">
        <h1>Welcome to David&apos;s Pillow Emporium!</h1>
        <p>
          Text me the names of the pillow cases you want. Inventory is limited.
        </p>
        <ul className="bullets">
          <li>The pillowcase body and cuff are cotton.</li>
          <li>Some accent fabric is a mix.</li>
          <li>To wash, turn inside-out and wash on delicates.</li>
          <li>Tumble dry or at low heat. Iron on low heat.</li>
        </ul>
        <button className="primary" onClick={onStart}>
          Begin <span className="arrow">→</span>
        </button>
        <div className="swipe-hint">Swipe right <span className="arrow">→</span></div>
      </div>
    </div>
  );
}

