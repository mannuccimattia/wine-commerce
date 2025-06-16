// Importazione delle dipendenze necessarie
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const CheckoutPage = () => {
    // Stato del form con tutti i campi necessari
    const [formData, setFormData] = useState({
        firstName: '',      // Nome cliente
        lastName: '',       // Cognome cliente
        email: '',         // Email per conferma ordine
        address: '',       // Indirizzo di spedizione
        city: '',          // Città
        cap: '',           // Codice postale
        cardNumber: '',    // Numero carta di credito
        cardExpiry: '',    // Data scadenza carta
        cardCVV: ''        // Codice sicurezza carta
    });

    // Gestore invio form
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implementare logica invio ordine al backend
        console.log('Order data:', formData);
    };

    // Gestore modifiche campi form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Sezione dati pagamento */}
                            <h4 className="mb-4 mt-5">Dati di Pagamento</h4>
                            <Form.Group className="mb-3">
                                <Form.Label>Numero Carta</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Data scadenza e CVV */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Scadenza (MM/AA)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cardExpiry"
                                            value={formData.cardExpiry}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cardCVV"
                                            value={formData.cardCVV}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Pulsante invio ordine */}
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-4"
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
                                <span>€ 150.00</span>
                            </div>
                            {/* Spese di spedizione */}
                            <div className="d-flex justify-content-between mb-2">
                                <span>Spedizione</span>
                                <span>€ 10.00</span>
                            </div>
                            {/* Totale finale */}
                            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                                <strong>Totale</strong>
                                <strong>€ 160.00</strong>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;