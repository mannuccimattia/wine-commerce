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
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-white">{`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name}`}</Card.Title>
        <WineGlasses
          label={wine.label_condition.rating}
          bottle={wine.bottle_condition.rating}
        />
        <div className="mt-auto">
          <p className="text-white mb-2">€ {wine.price}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WineCard;
