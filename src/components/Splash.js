export default function Splash({ onStart }) {
  return (
    <div className="splash">
      <div className="splash-card">
        <h1>Welcome to David&apos;s Pillow Emporium!</h1>
        <p>
          Send me the names of the pillow cases you want. Inventory is shown, and limited.
        </p>
        <ul className="bullets">
          <li>The pillowcase body and cuff are cotton.</li>
          <li>Some accent fabric is a mix.</li>
          <li>To wash, turn inside-out and wash on delicates.</li>
          <li>Tumble dry or at low heat. Iron on low heat.</li>
        </ul>

        <p>
          I used good fabric and threads, they can last for years.

          Send me your experiences and I'll post them anonymously here.
        </p>
        <button className="primary" onClick={onStart}>
          Begin
        </button>
      </div>
    </div>
  );
}

