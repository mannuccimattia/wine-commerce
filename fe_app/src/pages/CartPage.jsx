import { useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCarrello } from "../contexts/cartContext";

const CartPage = () => {
  const { carrello, rimuoviDalCarrello, aggiornaQuantita } = useCarrello();
  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 1000;
  const navigate = useNavigate();

  // Calculate subtotal
  const calculateSubtotal = () => {
    return carrello.reduce((acc, item) => acc + item.qty * item.prezzo, 0);
  };

  // Calculate shipping based on subtotal
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // Rendering conditional for empty cart
  if (carrello.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center text-white">
          <h2 className="mb-4">Il tuo carrello è vuoto</h2>
          <Link to="/products" className="btn btn-outline-light">
            Continua lo Shopping
          </Link>
        </div>
      </Container>
    );
  }

  // Main rendering of the cart
  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Carrello</h2>
      <Row>
        {/* Left column - Product list */}
        <Col lg={8}>
          {carrello.map((item) => (
            <Card key={item.id} className="mb-3 bg-dark text-white">
              <Card.Body>
                <Row className="align-items-center">
                  {/* Product name */}
                  <Col xs={9} md={6}>
                    <div className="d-flex align-items-center">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.nome}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginRight: "15px",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <h5 className="mb-0">{item.nome}</h5>
                    </div>
                  </Col>

                  {/* Quantity controls */}
                  <Col xs={6} md={3} className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => aggiornaQuantita(item.id, item.qty - 1)}
                        disabled={item.qty === 1}
                      >
                        -
                      </Button>
                      <span className="mx-3">{item.qty}</span>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => aggiornaQuantita(item.id, item.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </Col>

                  {/* Total price for product */}
                  <Col xs={6} md={2} className="text-end">
                    <p className="mb-0">
                      € {(item.prezzo * item.qty).toFixed(2)}
                    </p>
                  </Col>

                  {/* Remove button */}
                  <Col xs={12} md={1} className="text-end">
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => rimuoviDalCarrello(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Right column - Order summary */}
        <Col lg={4}>
          <Card className="bg-dark text-white p-4">
            <h4 className="mb-4">Riepilogo Ordine</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotale</span>
              <span>€{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Spedizione</span>
              <span>€{calculateShipping().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
              <strong>Totale</strong>
              <strong>€{calculateTotal().toFixed(2)}</strong>
            </div>
            {calculateSubtotal() > 0 && calculateShipping() > 0 && (
              <small className="text-muted d-block mt-2">
                Spedizione gratuita per ordini superiori a €{SOGLIA_SPEDIZIONE}
              </small>
            )}
            <Link to="/checkout" className="btn btn-outline-light w-100 mt-3">
              Procedi al Checkout
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
