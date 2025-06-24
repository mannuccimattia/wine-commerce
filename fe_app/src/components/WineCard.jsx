import { useState } from "react";
import { Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import WineGlasses from "./WineGlasses";
import { useCarrello } from "../contexts/CartContext"; // Import the context
import CategoryBadge from "./CategoryBadge";

const WineCard = ({ wine }) => {
  const [activeImage, setActiveImage] = useState(wine.image_front_url);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { aggiungiAlCarrello } = useCarrello();

  const handleClick = () => {
    navigate(`/wine/${wine.slug}`); // <-- Usa lo slug qui
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    aggiungiAlCarrello(wine, 1);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Card
      className="h-100 wine-card position-relative"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={activeImage}
        alt={wine.name}
        onMouseOver={() => setActiveImage(wine.image_back_url)}
        onMouseOut={() => setActiveImage(wine.image_front_url)}
      />
      <Card.Body className="d-flex flex-column pb-0">
        <Card.Title className="text-white">
          {`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name}`}
        </Card.Title>
        <WineGlasses
          label={wine.label_condition.rating}
          bottle={wine.bottle_condition.rating}
        />
        <div className="ms-1">
          <CategoryBadge categoryId={wine.category.id} />
        </div>
        <div className="my-2 px-2 pb-2 d-flex justify-content-between align-items-center position-relative">
          <span className="text-white card-price">€ {wine.price}</span>
          <button
            className="btn btn-outline-light"
            onClick={handleAddToCart} // Call the add to cart function
          >
            <i className="fa-solid fa-shopping-cart"></i>
          </button>
        </div>
      </Card.Body>

      {showAlert && (
        <Alert
          variant="success"
          className="position-absolute top-0 start-50 translate-middle-x mt-2"
          style={{ zIndex: 1000, width: "90%" }}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          ({wine.name} x1) Added to cart!
        </Alert>
      )}
    </Card>
  );
};

export default WineCard;
