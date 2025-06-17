// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const CheckoutPage = () => {
  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 300;

  //Define state variabiles for cart
  const [subtotale, setSubtotale] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [totale, setTotale] = useState(0);

  useEffect(() => {
    //importing localstorage variabiles + logical shipping cost
    const storedSubtotale = parseFloat(localStorage.getItem("subtotale")) || 0;
    const shippingCost =
      storedSubtotale > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;
    const totalAmount = storedSubtotale + shippingCost;
    setSubtotale(storedSubtotale);
    setShipping(shippingCost);
    setTotale(totalAmount);
  }, []);

  // Stato del form con tutti i campi necessari
  const [formData, setFormData] = useState({
    firstName: "", // Nome cliente
    lastName: "", // Cognome cliente
    email: "", // Email per conferma ordine
    address: "", // Indirizzo di spedizione
    city: "", // Città
    zip_code: "", // Codice postale
  });

  // Gestore invio form
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementare logica invio ordine al backend
    console.log("Order data:", formData);
  };

  // Gestore modifiche campi form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Checkout</h2>
      <Row>
        {/* Colonna sinistra - Form dati cliente */}
        <Col md={8}>
          <Card className="bg-dark text-white p-4 mb-4">
            <Form onSubmit={handleSubmit}>
              {/* Sezione dati personali */}
              <h4 className="mb-4">Dati di Spedizione</h4>
              <Row>
                {/* Campo Nome */}
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
                {/* Campo Cognome */}
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

              {/* Campo Email */}
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

              {/* Indirizzo di spedizione */}
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

              {/* Città e CAP */}
              <Row>
                <Col md={8}>
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
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CAP</Form.Label>
                    <Form.Control
                      type="text"
                      name="cap"
                      value={formData.cap}
                      onChange={handleChange}
                      required
                      pattern="\d{5}"
                      inputMode="numeric"
                      maxLength={5}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Pulsante invio ordine */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-4"
                disabled={!subtotale}
              >
                Completa Ordine
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Colonna destra - Riepilogo ordine */}
        <Col md={4}>
          <Card className="bg-dark text-white p-4">
            <h4 className="mb-4">Riepilogo Ordine</h4>
            {/* TODO: Integrare con il componente Carrello */}
            <div className="border-top pt-3 mt-3">
              {/* Subtotale */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotale</span>
                <span>{subtotale}</span>
              </div>
              {/* Spese di spedizione */}
              <div className="d-flex justify-content-between mb-2">
                <span>Spedizione</span>
                <span>{subtotale ? shipping : 0}</span>
              </div>
              {/* Totale finale */}
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <strong>Totale</strong>
                <strong>€{subtotale ? totale : 0}</strong>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
