// If you have a dedicated CSS file for this, keep/import it too:
// import './Splash.css';

export default function Splash({ onStart }) {
  const splashStyle = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundImage: "url('/pillowcase_images/welcome.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: 'black',
  };

  const cardStyle = {
    position: 'relative',
    maxWidth: '700px',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '30px 40px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    color: 'black',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.35)',
    color: 'black',
  };

  return (
    <div className="splash" style={splashStyle}>
      <div className="splash-overlay" style={overlayStyle} />
      <div className="splash-card" style={cardStyle}>
        <h1>Welcome to David&apos;s Pillow Emporium!</h1>
        <p style={cardStyle}>
           Do you want a hand made pillowcase?  You've been invited to select pillowcases for free, shipping included.  I made about a hundred pillowcases this year and want to share the results with friends and family.
        </p>
        <p style={cardStyle}>
          When you swipe, you'll see the "anatomy of a pillowcase" page.  It explains that all pillowcases have a body, cuff, and accent.  Keep swiping to see photos of the pillowcases left in inventory.  
        </p>
        <p style={cardStyle}> Sorry, no electronic fulfillment.  Email me the name of the pillowcase you want, and your desired shipping address.  Pillowcases will ship in January. david.martin@gmail.com
        </p>

        <button className="primary" onClick={onStart}>
          Begin
        </button>
      </div>
    </div>
  );
}

        // <ul style={cardStyle} className="bullets">
        //   <li>To wash, turn inside-out and wash on delicates.</li>
        //   <li>Tumble dry or at low heat. Iron on low heat.</li>
        //   <li>The accents can wrinkle a bit; adds character?</li>
        // </ul>

        // <p style={cardStyle}>
        //   I used good fabric and threads, but some pillowcases frayed when washed.
        //   Also, some pillowcases are slightly narrow, and an overstuffed pillow will be a fight.
        //   If you have an issue contact me for a replacement. 
        // </p>