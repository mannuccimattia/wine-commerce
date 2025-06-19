import React, { useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import axios from "axios";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip_code: "",
  });

  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 300;

  const calculateShipping = () => {
    const cartItems = JSON.parse(localStorage.getItem("carrello")) || [];
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.prezzo * item.qty,
      0
    );
    return subtotal > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (loading) return; // Previeni doppi click
    setLoading(true);

    try {
      const cartItems = JSON.parse(localStorage.getItem("carrello")) || [];
      if (cartItems.length === 0) {
        alert("Il carrello è vuoto");
        setLoading(false);
        return;
      }

      const shippingCost = calculateShipping();

      // Salva i dati per l'email di conferma
      const orderData = {
        cartItems,
        shippingCost,
        customerEmail: formData.email,
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zip_code,
        },
      };
      localStorage.setItem("orderData", JSON.stringify(orderData));

      // Solo chiamata Stripe checkout, rimuovi qualsiasi altra chiamata API
      const response = await axios.post(
        "http://localhost:3000/api/order/create-checkout-session",
        {
          cartItems,
          shippingCost,
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore durante il checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Checkout</h2>
      <Row>
        <Col md={8}>
          <Card className="bg-dark text-white p-4 mb-4">
            <Form onSubmit={handleCheckout}>
              <h4 className="mb-4">Informazioni di Spedizione</h4>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Indirizzo</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Città</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CAP</Form.Label>
                    <Form.Control
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-4 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary py-3 px-5"
                  style={{ minWidth: "200px" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Elaborazione...
                    </>
                  ) : (
                    `Paga €${
                      (
                        JSON.parse(localStorage.getItem("carrello")) || []
                      ).reduce((acc, item) => acc + item.prezzo * item.qty, 0) +
                      calculateShipping()
                    }`
                  )}
                </button>
              </div>
            </Form>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-dark text-white p-4">
            <h4 className="mb-4">Riepilogo Ordine</h4>
            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotale</span>
                <span>
                  €
                  {(JSON.parse(localStorage.getItem("carrello")) || [])
                    .reduce((acc, item) => acc + item.prezzo * item.qty, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Spedizione</span>
                <span>€{calculateShipping().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <strong>Totale</strong>
                <strong>
                  €
                  {(
                    (JSON.parse(localStorage.getItem("carrello")) || []).reduce(
                      (acc, item) => acc + item.prezzo * item.qty,
                      0
                    ) + calculateShipping()
                  ).toFixed(2)}
                </strong>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
