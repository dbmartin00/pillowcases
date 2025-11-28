import { useRef, useState } from "react";
import "./Viewer.css";

function toImgPath(filename) {
  return `${process.env.PUBLIC_URL}/pillowcase_images/${filename}`;
}

export default function Viewer({ item, index, total, onNext, onPrev }) {
  const touchStartX = useRef(null);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (dx < -threshold) onNext();
    if (dx > threshold) onPrev();
    touchStartX.current = null;
  };

  if (!item) {
    return (
      <div className="app-root center">
        <div className="empty">No pillowcases found.</div>
      </div>
    );
  }

  const src = toImgPath(item.filename);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className="viewer"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {!imgError ? (
        <img
          className="photo"
          src={src}
          alt={item.name || "Pillowcase"}
          onError={() => {
            console.error("Image failed to load:", src);
            setImgError(true);
          }}
        />
      ) : (
        <div
          className="app-root center"
          style={{ textAlign: "center", padding: 24 }}
        >
          <div className="error" style={{ marginBottom: 8 }}>
            Couldn’t load image.
          </div>
          <code>{src}</code>
        </div>
      )}

      <div className="topbar">
        <span className="badge">
          {index + 1} / {total}
        </span>
      </div>

      {/* Overlay always shown */}
      <div className="caption">
        <div className="name">{item.name}</div>

        {/* Copy button + copied message */}
        <div className="copy-row">
          <button className="copy-btn" onClick={handleCopy}>
            Copy Pillowcase Name
          </button>
          {copied && <span className="copied-msg">copied ✓</span>}
        </div>

        <div className="stock">{item.quantity} in stock</div>
        <div className="hint">← swipe • swipe →</div>
      </div>

      <button
        className="nav left"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        className="nav right"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

