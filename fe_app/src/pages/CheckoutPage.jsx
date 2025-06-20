import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const SPESE_SPEDIZIONE = 8.9;
    const SOGLIA_SPEDIZIONE = 300;

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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cliente = { ...formData };
        const carrello = JSON.parse(localStorage.getItem("carrello")) || [];
        const subtotale = parseFloat(localStorage.getItem("subtotale")) || 0;
        const shipping = subtotale > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;
        const totale = subtotale + shipping;

        const orderDetail = {
            cliente,
            carrello,
            subtotale: subtotale.toFixed(2),
            shippingCost: shipping.toFixed(2),
        };

        axios
            .post("http://localhost:3000/api/order", orderDetail)
            .then((response) => {
                console.log("Risposta dal server:", response.data);
                //Svuoto carrello
                localStorage.removeItem("carrello");
                localStorage.removeItem("subtotale");
                console.log("Carrello svuotato");
                // Redirect alla pagina di successo
                navigate("/success");
            })
            .catch((error) => {
                console.error("Errore nella richiesta: ", error);
            });
    };

    return (
        <Container className="py-5">
            <h2 className="text-white mb-4">Checkout</h2>
            <Row>
                <Col md={8}>
                    <Card className="bg-dark text-white p-4 mb-4">
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-4">Dati di Spedizione</h4>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="firstName">
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
                                    <Form.Group className="mb-3" controlId="lastName">
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

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="address">
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
                                <Col md={8}>
                                    <Form.Group className="mb-3" controlId="city">
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
                                    <Form.Group className="mb-3" controlId="zip_code">
                                        <Form.Label>CAP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="zip_code"
                                            value={formData.zip_code}
                                            onChange={handleChange}
                                            required
                                            pattern="\d{5}"
                                            inputMode="numeric"
                                            maxLength={5}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <div className="mt-4 d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className="btn btn-outline-light py-3 px-5"
                                        style={{ minWidth: "200px" }}
                                    >
                                        {`Paga €${(
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
                        <h4 className="mb-4">Riepilogo Ordine</h4>
                        {/* Visualizza immagini prodotti */}
                        <div className="mb-3">
                            {(JSON.parse(localStorage.getItem('carrello')) || []).map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center mb-2">
                                    <img src={item.img} alt={item.nome} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '5px' }} />
                                    <span>{item.nome} x {item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-top pt-3 mt-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotale</span>
                                <span>€{subtotale.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Spedizione</span>
                                <span>€{subtotale ? shipping.toFixed(2) : "0.00"}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                                <strong>Totale</strong>
                                <strong>€{subtotale ? totale.toFixed(2) : "0.00"}</strong>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
