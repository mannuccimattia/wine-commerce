import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import WineCard from "../components/WineCard";
import Loader from "../components/Loader";

const ProductsPage = () => {
  const [wines, setWines] = useState([]); // stato locale per i vini

  useEffect(() => {
    const fetchWines = async () => {
      const endpoint = "http://localhost:3000/api/wines";
      try {
        const response = await axios.get(endpoint);
        setWines(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    setTimeout(() => {
      fetchWines();
    }, 500);

    return () => {
      setWines([]);
    };
  }, []);

  return (
    <Container className="py-4">
      {wines.length === 0 ? (
        <Loader />
      ) : (
        <Row className="g-4">
          {wines.map((wine) => (
            <Col key={wine.id} sm={12} md={6} xl={4} xxl={3}>
              <WineCard wine={wine} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProductsPage;
