import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Bestseller = () => {
  const [bestsellerWines, setBestsellerWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestsellerWines = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:3000/api/wines/bestseller"
        );
        setBestsellerWines(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento dei bestseller:", err);
        setLoading(false);
      }
    };

    fetchBestsellerWines();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-white">Bestseller</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <Row>
          {bestsellerWines.map((wine) => (
            <Col key={wine.id} md={3} className="mb-4">
              <Card
                className="h-100 shadow-sm hover-effect"
                onClick={() => navigate(`/wine/${wine.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src={wine.image_front_url}
                  alt={wine.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center">{wine.name}</Card.Title>
                  <Card.Text className="text-center">€{wine.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Bestseller;
