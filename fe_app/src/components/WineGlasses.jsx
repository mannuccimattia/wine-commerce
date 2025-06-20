const WineGlasses = ({ label, bottle }) => {

  const avg = Math.floor(parseInt((label + bottle) / 2));
  let icon;
  let msg;
  console.log(label, bottle)

  switch (avg) {
    case 1:
      icon = "🏺";
      msg = "A relic with soul. Time has etched its story.";
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
      icon = "🪔";
      msg = "Flawless. As if preserved by fate.";
      break;
  }

  // const renderGlasses = () => {
  //   return [1, 2, 3, 4, 5].map((_, i) => (
  //     <i
  //       key={`glass-${i}`}
  //       className={`fa-solid color-wine ${i < avg ? "fa-wine-glass" : "fa-wine-glass-empty"
  //         }`}
  //       style={{ marginRight: "5px" }}
  //     ></i>
  //   ));
  // };

  return (
    <div className="position-relative">
      <div
        className="mb-2 px-2 py-1 border border-secondary pill rounded-pill bg-transparent text-secondary d-inline-flex align-items-center"
        id=""
      >
        <span
          className="fw-bold"
        >Provenance Tier</span>
        <div className="ms-2">{icon}</div>
      </div>
      <div id="pt-hover" className="rounded-pill px-2 py-1">
        {msg}
      </div>
    </div>
  )
};

export default WineGlasses;
