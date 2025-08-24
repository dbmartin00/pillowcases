export default function Splash({ onStart }) {
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
          Swipe right → to begin
        </button>
        <div className="swipe-hint">→ swipe right</div>
      </div>
    </div>
  );
}

