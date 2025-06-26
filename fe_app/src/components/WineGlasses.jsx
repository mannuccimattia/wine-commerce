const WineGlasses = ({ label, bottle }) => {

  const avg = Math.floor(parseInt((label + bottle) / 2));
  let icon;
  let msg;

  switch (avg) {
    case 1:
      icon = "🏺";
      msg = "A relic bearing history's touch.";
      break;
    case 2:
      icon = "🍷";
      msg = "Noble character. A past well lived.";
      break;
    case 3:
      icon = "🍾";
      msg = "Timeless elegance. Aged with intention.";
      break;
    case 4:
      icon = "✨";
      msg = "Near perfection. A collector’s dream.";
      break;
    case 5:
      icon = "💎";
      msg = "Flawless. As if preserved by fate.";
      break;
  }

  return (
    <div className="position-relative provenance-tier-wrapper">
      <div
        className="mb-2 px-2 py-1 border border-secondary pill rounded-pill bg-transparent text-secondary d-inline-flex align-items-center"
      >
        <span
          className="fw-bold"
        >Provenance Tier</span>
        <div className="ms-2">{icon}</div>
      </div>
      {window.location.pathname !== "/wine/:id" &&
        <div className="pt-hover rounded-pill px-2 py-1">
          {msg}
        </div>
      }

    </div>
  )
};

export default WineGlasses;
