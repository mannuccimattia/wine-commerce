import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import GlobalContext from "../contexts/globalContext";
import WineGlasses from "../components/WineGlasses";

const Winepage = () => {
  const { id } = useParams();
  const [wine, setWine] = useState(null);
  const { setIsLoading } = useContext(GlobalContext);

  useEffect(() => {
    const fetchWine = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/wines/${id}`
        );

        setWine(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWine();
  }, [id]);

  //Aggiunta al carrello + subtotale
  const aggiungiAlCarrello = (wine) => {
    const carrello = JSON.parse(localStorage.getItem("carrello")) || [];

    const prodottoEsistente = carrello.find((item) => item.id === wine.id);

    if (prodottoEsistente) {
      prodottoEsistente.qty += 1;
      console.log(
        `✔️ Aumentata quantità di "${wine.name}" a ${prodottoEsistente.qty}`
      );
    } else {
      carrello.push({
        id: wine.id,
        nome: wine.name,
        prezzo: wine.price,
        qty: 1,
      });
      console.log(`🆕 Aggiunto "${wine.name}" al carrello`);
    }

    const subtotale = carrello.reduce((acc, item) => {
      return acc + item.qty * (item.prezzo || 0);
    }, 0);

    localStorage.setItem("carrello", JSON.stringify(carrello));
    localStorage.setItem("subtotale", subtotale.toFixed(2));

    console.log("🛒 Carrello attuale:", carrello);
    console.log("💰 Subtotale aggiornato:", subtotale.toFixed(2));
  };

  if (!wine) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <Container className="py-5" id="winepage-container">
      <Row className="gx-4">
        <Col lg={6}>
          <div className="position-sticky" style={{ top: "2rem" }}>
            <Image
              src={wine.image_front_url}
              alt={wine.name}
              fluid
              className="rounded shadow-lg mb-3"
              style={{ maxHeight: "600px", width: "100%", objectFit: "cover" }}
            />
            <Image
              src={wine.image_back_url}
              alt={`${wine.name} retro`}
              fluid
              className="rounded shadow-lg"
              style={{ maxHeight: "600px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </Col>
        <Col lg={6}>
          <div className="text-white">
            <h1 className="fw-semibold">
              {`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name} `}
            </h1>
            <div className="my-5">
              <WineGlasses rating={wine.label_condition?.rating} />
              <div className="my-5">
                <span className="fw-bold" id="price-tag">€ {wine.price}</span>
              </div>
              {wine.stock > 0 && (
                <small className="text-white-50">
                  Disponibilità: {wine.stock} bottiglie
                </small>
              )}
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
            <div className="border-top border-white-50 pt-4 mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">Prezzo</h3>
                  <p className="display-4 mb-0">€ {wine.price}</p>
                </div>
                {wine.stock > 0 ? (
                  <button
                    className="btn btn-outline-light btn-lg"
                    onClick={() => aggiungiAlCarrello(wine)}
                  >
                    Aggiungi al carrello
                  </button>
                ) : (
                  <button className="btn btn-outline-danger btn-lg" disabled>
                    Non disponibile
                  </button>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Winepage;
