import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";
import GlobalContext from "../contexts/globalContext";
import WineGlasses from "../components/WineGlasses";
import { useNavigate } from "react-router-dom";
import CartSidebar from "../components/CartSidebar";

const Winepage = () => {
  const { id } = useParams();
  const [wine, setWine] = useState(null);
  const { setIsLoading } = useContext(GlobalContext);
  const [alertMsg, setAlertMsg] = useState("");
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    const fetchWine = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/wines/${id}`
        );
        setWine(response.data);
        setMainImage(response.data.image_front_url); // Mostra frontale all'inizio
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
      setAlertMsg(` ${wine.name} aumentata a ${prodottoEsistente.qty}`);
    } else {
      carrello.push({
        id: wine.id,
        nome: wine.name,
        prezzo: wine.price,
        qty: 1,
        img: wine.image_front_url,
      });
      setAlertMsg(`${wine.name} aggiunto al carrello!`);
    }

    // Nascondi l'alert dopo 3 secondi
    setTimeout(() => setAlertMsg(""), 3000);

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
        <CartSidebar />
        <Col sm={12} md={6}>
          <div>
            <Image
              src={mainImage}
              alt={wine.name}
              fluid
              className="rounded shadow-lg mb-3"
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
        <Col sm={12} md={6}>
          <div className="text-white">
            <h1 className="fw-semibold">
              {`${wine.winemaker.name} ${wine.vintage} ${wine.name} ${wine.denomination.name} `}
            </h1>
            <div className="my-5">

              <WineGlasses
                label={wine.label_condition?.rating}
                bottle={wine.bottle_condition?.rating}
              />
              <div className="mt-4">
                <div className="fs-5" id="condizioni">
                  <p>
                    <strong>Bottle:</strong> {wine.bottle_condition.name}
                  </p>
                  <p>
                    <strong>Label:</strong> {wine.label_condition.name}
                  </p>
                </div>
              </div>
              <div className="my-5 pe-3 d-flex justify-content-between align-items-center">
                <span className="fw-bold" id="price-tag">
                  € {wine.price}
                </span>
                <button
                  className="btn btn-outline-light btn-lg"
                  onClick={() => aggiungiAlCarrello(wine)}
                >
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <div className="mb-4">
            <div className="" id="details">
              <div>
                <strong>Producer:</strong> {wine.winemaker.name}
              </div>
              <div>
                <strong>Region:</strong> {wine.region.name}
              </div>
              <div>
                <strong>Category:</strong> {wine.category.name}
              </div>
              <div>
                <strong>Denomination:</strong> {wine.denomination.name}
              </div>
              <div>
                <strong>Vintage:</strong> {wine.vintage}
              </div>
              <div>
                <strong>Grapes:</strong> {wine.grape_type}
              </div>
              <div>
                <strong>ABV:</strong> {wine.alcol}%
              </div>
              <div>
                <strong>Volume:</strong> {wine.bottle_size}L
              </div>
              <div>
                <strong>Temperature:</strong> {wine.temperature}°C
              </div>
            </div>
          </div>

          <div className="mb-4" id="descr">
            {wine.description}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Winepage;
