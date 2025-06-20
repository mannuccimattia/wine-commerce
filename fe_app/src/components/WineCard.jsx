import { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import WineGlasses from "./WineGlasses";

const WineCard = ({ wine }) => {
  const [activeImage, setActiveImage] = useState(wine.image_front_url);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/wine/${wine.id}`);
  };

  return (
    <Card
      className="h-100 wine-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={activeImage}
        alt={wine.name}
        style={{ height: "300px", objectFit: "cover" }}
        onMouseOver={() => setActiveImage(wine.image_back_url)}
        onMouseOut={() => { setActiveImage(wine.image_front_url) }}
      />
      <Card.Body className="d-flex flex-column pb-0">
        <Card.Title className="text-white">{`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name}`}</Card.Title>
        <WineGlasses
          label={wine.label_condition.rating}
          bottle={wine.bottle_condition.rating}
        />
        <div className="my-2 px-2 pb-2 d-flex justify-content-between align-items-center position-relative">
          <span className="text-white">€ {wine.price}</span>
          <button
            className="btn btn-outline-light"
            id="card-shopping"
            onClick={e => {
              e.stopPropagation();
              // Add your cart logic here
            }}
          >
            <i className="fa-solid fa-shopping-cart"></i>
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WineCard;
