import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Spinner } from "react-bootstrap";
import WineCard from "./WineCard";

const WineCardAll = () => {
  const [topWines, setTopWines] = useState([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = {
    Rosso: 1,
    Bianco: 2,
    Champagne: 3,
    Spumante: 4,
  };

  useEffect(() => {
    const fetchTopWineByCategory = async (categoryName, categoryId) => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/wines/category/${categoryId}`
        );
        const wines = res.data;

        wines.sort((a, b) => b.price - a.price);
        const topWine = wines[0];

        return {
          ...topWine,
          category_name: categoryName,
        };
      } catch (err) {
        console.error(`Errore nella categoria ${categoryName}:`, err);
        return null;
      }
    };

    const loadAll = async () => {
      const categories = [
        fetchTopWineByCategory("Red Wines", CATEGORIES.Rosso),
        fetchTopWineByCategory("White Wines", CATEGORIES.Bianco),
        fetchTopWineByCategory("Champagne", CATEGORIES.Champagne),
        fetchTopWineByCategory("Spumanti", CATEGORIES.Spumante),
      ];

      const results = await Promise.all(categories);
      const filtered = results.filter((w) => w !== null);
      setTopWines(filtered);
      setLoading(false);
    };

    loadAll();
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
          {topWines.map((wine) => (
            <Col key={wine.id} sm={12} md={6} xl={4} xxl={3} className="mb-4">
              <WineCard wine={wine} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WineCardAll;