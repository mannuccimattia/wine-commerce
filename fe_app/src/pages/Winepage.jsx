import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import axios from "axios";
import GlobalContext from "../contexts/globalContext";
import WineGlasses from "../components/WineGlasses";
import { useCarrello } from "../contexts/cartContext";

const Winepage = () => {
  const { id } = useParams();
  const [wine, setWine] = useState(null);
  const { setIsLoading } = useContext(GlobalContext);
  const [mainImage, setMainImage] = useState(null);
  const { carrello, aggiungiAlCarrello, rimuoviDalCarrello, aggiornaQuantita } =
    useCarrello(); // Use the context to manage cart
  const [quantity, setQuantity] = useState(1); // Set default quantity to 1

  useEffect(() => {
    const fetchWine = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/wines/${id}`
        );
        setWine(response.data);
        setMainImage(response.data.image_front_url); // Show front image initially

        // Check if the wine is already in the cart
        const existingProduct = carrello.find(
          (item) => item.id === response.data.id
        );
        if (existingProduct) {
          setQuantity(existingProduct.qty); // Set quantity to existing qty
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWine();
  }, [id, carrello]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = Math.max(0, prev + change); // Ensure quantity does not go below 0
      if (newQuantity === 0) {
        rimuoviDalCarrello(wine.id); // Remove from cart if quantity is 0
      }
      return newQuantity;
    });
  };

  const handleAddOrUpdateCart = () => {
    if (quantity > 0) {
      const existingProduct = carrello.find((item) => item.id === wine.id);
      if (existingProduct) {
        // Update quantity in cart
        aggiornaQuantita(wine.id, quantity);
      } else {
        // Add new product to cart with the selected quantity
        aggiungiAlCarrello(wine, quantity); // Pass the selected quantity here
      }
    }
  };

  if (!wine) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const isInCart = carrello.some((item) => item.id === wine.id);

  return (
    <Container className="py-5" id="winepage-container">
      <Row className="gx-4">
        <Col lg={6}>
          <div className="position-sticky" style={{ top: "2rem" }}>
            <Image
              src={mainImage}
              alt={wine.name}
              fluid
              className="rounded shadow-lg mb-3"
              style={{ maxHeight: "600px", width: "100%", objectFit: "cover" }}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <Image
                src={wine.image_front_url}
                alt="front preview"
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  border:
                    mainImage === wine.image_front_url
                      ? "2px solid #B1A44B"
                      : "2px solid #fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => setMainImage(wine.image_front_url)}
              />
              <Image
                src={wine.image_back_url}
                alt="back preview"
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  border:
                    mainImage === wine.image_back_url
                      ? "2px solid #B1A44B"
                      : "2px solid #fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => setMainImage(wine.image_back_url)}
              />
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="text-white">
            <h1 className="fw-semibold">
              {`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name}`}
            </h1>
            <div className="my-5">
              <WineGlasses rating={wine.label_condition?.rating} />
              <div className="my-5">
                <span className="fw-bold" id="price-tag">
                  € {wine.price}
                </span>
              </div>
              {wine.stock > 0 ? (
                <small className="text-white-50">
                  Disponibilità: {wine.stock} bottiglie
                </small>
              ) : (
                <small className="text-danger">Prodotto esaurito</small>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 0}
                >
                  -
                </button>
                <span className="mx-3">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            {/* Add or Update Cart Button */}
            <div className="mb-4">
              <button
                className="btn btn-outline-light btn-lg"
                onClick={handleAddOrUpdateCart}
              >
                {isInCart ? "Aggiorna quantità" : "Aggiungi al carrello"}
              </button>
            </div>

            <div className="mb-4">
              <div className="fs-5" id="details">
                <p>
                  <strong>Produttore:</strong> {wine.winemaker.name}
                </p>
                <p>
                  <strong>Regione:</strong> {wine.region.name}
                </p>
                <p>
                  <strong>Categoria:</strong> {wine.category.name}
                </p>
                <p>
                  <strong>Denominazione:</strong> {wine.denomination.name}
                </p>
                <p>
                  <strong>Annata:</strong> {wine.vintage}
                </p>
                <p>
                  <strong>Uvaggio:</strong> {wine.grape_type}
                </p>
                <p>
                  <strong>Gradazione:</strong> {wine.alcol}%
                </p>
                <p>
                  <strong>Formato:</strong> {wine.bottle_size}L
                </p>
                <p>
                  <strong>Temperatura di servizio:</strong> {wine.temperature}°C
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="fs-5" id="condizioni">
                <p>
                  <strong>Bottiglia:</strong> {wine.bottle_condition.name}
                </p>
                <p>
                  <strong>Etichetta:</strong> {wine.label_condition.name}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="fs-5">{wine.description}</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Winepage;
