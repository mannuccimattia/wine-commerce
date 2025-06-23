import { useState } from "react";
import { Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import WineGlasses from "./WineGlasses";
import { useCarrello } from "../contexts/cartContext"; // Import the context
import CategoryBadge from "./CategoryBadge";

const WineCard = ({ wine }) => {
  const [activeImage, setActiveImage] = useState(wine.image_front_url);
  const [showAlert, setShowAlert] = useState(false); // stato per alert
  const navigate = useNavigate();
  const { aggiungiAlCarrello } = useCarrello(); // Access the context

  const handleClick = () => {
    navigate(`/wine/${wine.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the card click event
    aggiungiAlCarrello(wine, 1); // Add the wine to the cart with a quantity of 1
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Nascondi alert dopo 3 secondi
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
        style={{ height: "300px", objectFit: "cover" }}
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
        <div>
          {" "}
          <CategoryBadge categoryId={wine.category.id} />
        </div>
        <div className="my-2 px-2 pb-2 d-flex justify-content-between align-items-center position-relative">
          <span className="text-white">€ {wine.price}</span>
          <button
            className="btn btn-outline-light"
            id="card-shopping"
            onClick={handleAddToCart} // Call the add to cart function
          >
            <i className="fa-solid fa-shopping-cart"></i>
          </button>
        </div>
      </Card.Body>

      {/* Alert temporaneo */}
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
