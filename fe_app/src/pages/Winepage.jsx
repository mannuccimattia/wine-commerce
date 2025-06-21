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
    useCarrello();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchWine = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/wines/${id}`
        );
        setWine(response.data);
        setMainImage(response.data.image_front_url);

        const existingProduct = carrello.find(
          (item) => item.id === response.data.id
        );
        if (existingProduct) {
          setQuantity(existingProduct.qty);
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
      const newQuantity = Math.max(0, prev + change);
      if (newQuantity === 0) {
        rimuoviDalCarrello(wine.id);
      }
      return newQuantity;
    });
  };

  const handleAddOrUpdateCart = () => {
    if (quantity > 0) {
      const existingProduct = carrello.find((item) => item.id === wine.id);
      if (existingProduct) {
        aggiornaQuantita(wine.id, quantity);
      } else {
        aggiungiAlCarrello(wine, quantity);
      }
    }
  };

  if (!wine) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const isInCart = carrello.some((item) => item.id === wine.id);

  return (
    <Container className="py-4" id="winepage-container">
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
            {/* Header Section */}
            <div className="mb-3">
              <h1 className="fw-semibold mb-2">
                {`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name}`}
              </h1>
              <WineGlasses rating={wine.label_condition?.rating} />
            </div>

            {/* Price and Stock Section */}
            <div className="mb-3">
              <div className="mb-2">
                <span
                  className="fw-bold fs-3"
                  id="price-tag"
                  style={{ color: "#B1A44B" }}
                >
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

            {/* Quantity and Cart Section */}
            <div
              className="mb-4 p-3 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              {/* Desktop Layout */}
              <div className="d-none d-md-flex align-items-center justify-content-between">
                {/* Quantity Selector */}
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 0}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px", minWidth: "35px" }}
                  >
                    -
                  </Button>
                  <span
                    className="mx-2 fw-bold fs-6"
                    style={{ minWidth: "40px", textAlign: "center" }}
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px", minWidth: "35px" }}
                  >
                    +
                  </Button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={handleAddOrUpdateCart}
                  className="px-4 py-2"
                  style={{ minWidth: "200px" }}
                >
                  {isInCart ? "Aggiorna quantità" : "Aggiungi al carrello"}
                </Button>
              </div>

              {/* Mobile Layout */}
              <div className="d-md-none">
                {/* Quantity Selector - Centered */}
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 0}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "45px", height: "45px", minWidth: "45px" }}
                  >
                    -
                  </Button>
                  <span
                    className="mx-4 fw-bold fs-4"
                    style={{ minWidth: "50px", textAlign: "center" }}
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "45px", height: "45px", minWidth: "45px" }}
                  >
                    +
                  </Button>
                </div>

                {/* Add to Cart Button - Full Width */}
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={handleAddOrUpdateCart}
                  className="w-100 py-3"
                >
                  {isInCart ? "Aggiorna quantità" : "Aggiungi al carrello"}
                </Button>
              </div>
            </div>

            {/* Wine Details Section */}
            <div className="mb-4">
              <h5 className="mb-3 fw-bold" style={{ color: "#B1A44B" }}>
                Dettagli del vino
              </h5>
              <Row className="g-2">
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Produttore:</strong>{" "}
                    <span className="text-white-75">{wine.winemaker.name}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Regione:</strong>{" "}
                    <span className="text-white-75">{wine.region.name}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Categoria:</strong>{" "}
                    <span className="text-white-75">{wine.category.name}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Denominazione:</strong>{" "}
                    <span className="text-white-75">
                      {wine.denomination.name}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Annata:</strong>{" "}
                    <span className="text-white-75">{wine.vintage}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Uvaggio:</strong>{" "}
                    <span className="text-white-75">{wine.grape_type}</span>
                  </div>
                  <div className="mb-2">
                    <strong>Gradazione:</strong>{" "}
                    <span className="text-white-75">{wine.alcol}%</span>
                  </div>
                  <div className="mb-2">
                    <strong>Formato:</strong>{" "}
                    <span className="text-white-75">{wine.bottle_size}L</span>
                  </div>
                  <div className="mb-2">
                    <strong>Temperatura:</strong>{" "}
                    <span className="text-white-75">{wine.temperature}°C</span>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Condition Section */}
            <div className="mb-4">
              <h5 className="mb-3 fw-bold" style={{ color: "#B1A44B" }}>
                Condizioni
              </h5>
              <div className="mb-2">
                <strong>Bottiglia:</strong>{" "}
                <span className="text-white-75">
                  {wine.bottle_condition.name}
                </span>
              </div>
              <div className="mb-2">
                <strong>Etichetta:</strong>{" "}
                <span className="text-white-75">
                  {wine.label_condition.name}
                </span>
              </div>
            </div>

            {/* Description Section */}
            {wine.description && (
              <div className="mb-4">
                <h5 className="mb-3 fw-bold" style={{ color: "#B1A44B" }}>
                  Descrizione
                </h5>
                <p className="text-white-75 lh-base">{wine.description}</p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Winepage;
