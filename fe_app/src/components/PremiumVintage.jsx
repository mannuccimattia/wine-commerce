import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Spinner } from "react-bootstrap";
import WineCard from "./WineCard";

const PremiumVintage = () => {
  const [premiumWines, setPremiumWines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumWines = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:3000/api/wines/premiumvintage"
        );
        setPremiumWines(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento dei Premium Vintage:", err);
        setLoading(false);
      }
    };

    fetchPremiumWines();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-white">Premium Vintage</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <Row>
          {premiumWines.map((wine) => (
            <Col
              key={`pv-${wine.id}`}
              sm={12}
              md={6}
              xl={4}
              xxl={3}
              className="mb-4"
            >
              <WineCard wine={wine} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PremiumVintage;
