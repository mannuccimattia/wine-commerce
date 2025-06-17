// pages/Checkout.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [carrello, setCarrello] = useState([]);
  const [subtotale, setSubtotale] = useState(0);
  const [spedizioneGratuita, setSpedizioneGratuita] = useState(false);
  const [totale, setTotale] = useState(0);
  const [errore, setErrore] = useState("");

  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE_GRATUITA = 100;

  const [datiSpedizione, setDatiSpedizione] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    citta: "",
    cap: "",
    provincia: "",
    note: "",
  });

  useEffect(() => {
    const carrelloStorage = JSON.parse(localStorage.getItem("carrello")) || [];
    const subtotaleStorage = parseFloat(localStorage.getItem("subtotale")) || 0;

    setCarrello(carrelloStorage);
    setSubtotale(subtotaleStorage);

    const gratuita = subtotaleStorage >= SOGLIA_SPEDIZIONE_GRATUITA;
    setSpedizioneGratuita(gratuita);
    setTotale(subtotaleStorage + (gratuita ? 0 : SPESE_SPEDIZIONE));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatiSpedizione((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validaDati = () => {
    const campiObbligatori = [
      "nome",
      "cognome",
      "email",
      "telefono",
      "indirizzo",
      "citta",
      "cap",
    ];

    for (const campo of campiObbligatori) {
      if (!datiSpedizione[campo].trim()) {
        setErrore(`Il campo ${campo} è obbligatorio`);
        return false;
      }
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datiSpedizione.email)) {
      setErrore("Inserisci un'email valida");
      return false;
    }

    // Validazione CAP
    const capRegex = /^[0-9]{5}$/;
    if (!capRegex.test(datiSpedizione.cap)) {
      setErrore("Inserisci un CAP valido (5 cifre)");
      return false;
    }

    return true;
  };

  const procediAlPagamento = () => {
    setErrore("");

    if (carrello.length === 0) {
      setErrore("Il carrello è vuoto");
      return;
    }

    if (!validaDati()) {
      return;
    }

    const spedizionePrezzo = spedizioneGratuita ? 0 : SPESE_SPEDIZIONE;

    // Salva i dati di spedizione in localStorage per la pagina di pagamento
    localStorage.setItem("datiSpedizione", JSON.stringify(datiSpedizione));
    localStorage.setItem("totaleOrdine", totale.toString());
    localStorage.setItem("spedizionePrezzo", spedizionePrezzo.toString());

    // Naviga alla pagina di pagamento
    navigate("/payment");
  };

  if (carrello.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-white">Il tuo carrello è vuoto</h2>
        <Button
          variant="outline-light"
          onClick={() => navigate("/")}
          className="mt-3"
        >
          Continua gli acquisti
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-white mb-4">Checkout</h1>

      <Row>
        <Col lg={8}>
          <Card className="bg-dark text-white border-secondary mb-4">
            <Card.Header>
              <h4>Dati di spedizione</h4>
            </Card.Header>
            <Card.Body>
              {errore && <Alert variant="danger">{errore}</Alert>}

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={datiSpedizione.nome}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cognome *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cognome"
                        value={datiSpedizione.cognome}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={datiSpedizione.email}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefono *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={datiSpedizione.telefono}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Indirizzo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="indirizzo"
                    value={datiSpedizione.indirizzo}
                    onChange={handleInputChange}
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Città *</Form.Label>
                      <Form.Control
                        type="text"
                        name="citta"
                        value={datiSpedizione.citta}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>CAP *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cap"
                        value={datiSpedizione.cap}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Provincia</Form.Label>
                      <Form.Control
                        type="text"
                        name="provincia"
                        value={datiSpedizione.provincia}
                        onChange={handleInputChange}
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Note (opzionale)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="note"
                    value={datiSpedizione.note}
                    onChange={handleInputChange}
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card
            className="bg-dark text-white border-secondary position-sticky"
            style={{ top: "2rem" }}
          >
            <Card.Header>
              <h4>Riepilogo ordine</h4>
            </Card.Header>
            <Card.Body>
              {carrello.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.nome} (x{item.qty})
                  </span>
                  <span>€ {(item.prezzo * item.qty).toFixed(2)}</span>
                </div>
              ))}

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotale</span>
                <span>€ {subtotale.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Spedizione</span>
                <span>
                  {spedizioneGratuita ? (
                    <span className="text-success">Gratuita</span>
                  ) : (
                    `€ ${SPESE_SPEDIZIONE.toFixed(2)}`
                  )}
                </span>
              </div>

              {!spedizioneGratuita && (
                <small className="text-muted">
                  Spedizione gratuita per ordini superiori a €{" "}
                  {SOGLIA_SPEDIZIONE_GRATUITA}
                </small>
              )}

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between mb-3">
                <strong>Totale</strong>
                <strong>€ {totale.toFixed(2)}</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={procediAlPagamento}
              >
                Procedi al pagamento
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
