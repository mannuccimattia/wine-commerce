import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 1000;

  const navigate = useNavigate();

  // Stato per riepilogo ordine
  const [subtotale, setSubtotale] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [totale, setTotale] = useState(0);

  // Stato form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip_code: "",
  });

  // Stato per gli errori di validazione
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  // Funzioni di validazione
  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'.-]{2,30}$/;
    return nameRegex.test(name.trim());
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateZipCode = (zipCode) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zipCode);
  };

  useEffect(() => {
    const storedSubtotale = parseFloat(localStorage.getItem("subtotale")) || 0;
    const shippingCost =
      storedSubtotale > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;
    const totalAmount = storedSubtotale + shippingCost;

    setSubtotale(storedSubtotale);
    setShipping(shippingCost);
    setTotale(totalAmount);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Gestione speciale per i diversi campi
    let processedValue = value;

    if (name === "zip_code") {
      // Solo numeri per il CAP, massimo 5 cifre
      processedValue = value.replace(/\D/g, "").slice(0, 5);
    } else if (name === "firstName" || name === "lastName" || name === "city") {
      // Solo lettere, spazi, apostrofi e trattini per nomi e città
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ\s'.-]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Rimuovi l'errore se il campo ora è valido
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleStripeCheckout = async () => {
    // Validazione form prima di procedere
    const newErrors = {};
    if (!formData.firstName || !validateName(formData.firstName)) {
      newErrors.firstName = "Please, inser a valid First Name.";
    }
    if (!formData.lastName || !validateName(formData.lastName)) {
      newErrors.lastName = "Please, inser a valid Last Name.";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Please, inser a valid Email Address.";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.city || !validateName(formData.city)) {
      newErrors.city = "Please, inser a valid City Name.";
    }
    if (!formData.zip_code || !validateZipCode(formData.zip_code)) {
      newErrors.zip_code = "ZIP code must be exactly 5 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please fill in all the required fields correctly.");
      return;
    }

    setFormError(""); // Reset del messaggio di errore

    const cartItems = JSON.parse(localStorage.getItem("carrello")) || [];
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.prezzo * item.qty,
      0
    );
    const shippingCost = subtotal > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;

    // Salva TUTTI i dati ordine per SuccessPage con la struttura corretta
    const orderData = {
      cartItems,
      shippingCost,
      subtotale: subtotal,
      customerEmail: formData.email,
      customerDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zip_code,
      },
    };

    // Salva i dati nel localStorage per la success page
    localStorage.setItem("orderData", JSON.stringify(orderData));

    try {
      const response = await axios.post(
        "http://localhost:3000/api/order/create-checkout-session",
        { cartItems, shippingCost, subtotale: subtotal },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Errore Stripe:", error);
      alert("Error connecting to Stripe");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Checkout</h2>
      {formError && <Alert variant="danger">{formError}</Alert>}
      <Row>
        <Col md={8}>
          <Card className="bg-dark text-white p-4 mb-4">
            <Form>
              <h4 className="mb-4">Shipping Information</h4>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.firstName}
                      placeholder="Enter your first name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.lastName}
                      placeholder="Enter your last name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.email}
                  placeholder="example@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.address}
                  placeholder="Street, house number"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>City *</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.city}
                      placeholder="City name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3" controlId="zip_code">
                    <Form.Label>Zip Code *</Form.Label>
                    <Form.Control
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.zip_code}
                      placeholder="12345"
                      maxLength={5}
                      inputMode="numeric"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zip_code}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <div className="mt-4 d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-light py-3 px-5"
                    style={{ minWidth: "200px" }}
                    onClick={handleStripeCheckout}
                  >
                    {`Pay now €${(
                      (
                        JSON.parse(localStorage.getItem("carrello")) || []
                      ).reduce((acc, item) => acc + item.prezzo * item.qty, 0) +
                      shipping
                    ).toFixed(2)}`}
                  </button>
                </div>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-white p-4">
            <h4 className="mb-4">Order Summary</h4>
            <div className="mb-3">
              {(JSON.parse(localStorage.getItem("carrello")) || []).map(
                (item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-2">
                    <img
                      src={item.img}
                      alt={item.nome}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    <div>
                      <div>{item.nome}</div>
                      <div>
                        {" "}
                        € {item.prezzo} x {item.qty}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{subtotale.toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>{subtotale ? shipping.toFixed(2) : "0.00"} €</span>
              </div>
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <strong>Total</strong>
                <strong>{subtotale ? totale.toFixed(2) : "0.00"} €</strong>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
