import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesCard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/wines/getcategories"
      );
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        setError(null);
      } else {
        setError("Invalid data format.");
        setCategories([]);
      }
    } catch (err) {
      setError("Error loading categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/categoria/${slug}`);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-white mt-2">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container my-5">
        <Alert variant="info" className="text-center">
          No categories available at the moment.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-white">Our Collections</h2>
      <Row>
        {categories.map((category) => (
          <Col key={category.id} sm={12} md={6} lg={3} className="mb-4">
            <Card
              className="h-100 shadow-sm hover-effect"
              onClick={() => handleCategoryClick(category.slug)}
              style={{ cursor: "pointer" }}
            >
              <Card.Img
                variant="top"
                src={
                  category.image ||
                  "/imgs/logo/boolze-high-resolution-logo-grayscale-transparent-cut.png"
                }
                alt={category.name}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src =
                    "/imgs/logo/boolze-high-resolution-logo-grayscale-transparent-cut.png";
                }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">{category.name}</Card.Title>
                <Card.Text className="text-center">
                  {category.description || "Discover our selection"}
                </Card.Text>
                {category.color && (
                  <div className="text-center mt-auto">
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        backgroundColor: category.color,
                        color: "#fff",
                      }}
                    >
                      {category.name}
                    </span>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoriesCard;
