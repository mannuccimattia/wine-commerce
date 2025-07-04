import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCarrello } from "../contexts/CartContext";

const CartPage = () => {
  const { carrello, rimuoviDalCarrello, aggiornaQuantita } = useCarrello();
  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 1000;

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
          <h2 className="mb-4">You cart is empty</h2>
          <Link to="/products" className="btn btn-outline-light">
            Continue shopping
          </Link>
        </div>
      </Container>
    );
  }

  // Main rendering of the cart
  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Your cart</h2>
      <Row>
        {/* Left column - Product list */}
        <Col lg={8}>
          {carrello.map((item) => (
            <Card key={item.id} className="mb-3 bg-dark text-white">
              <Card.Body>
                {/* Desktop view: single row layout */}
                <div className="row justify-content-between align-items-center">
                  <div className="col-11 col-md-7 cart-item-link">
                    <div className="row">
                      <Link
                        to={`/wine/${item.slug}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div className="col-4">
                          <img
                            src={item.img}
                            alt={item.nome}
                            style={{
                              width: "100%",
                              aspectRatio: 1 / 1,
                              objectFit: "cover",
                              marginRight: "15px",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                        <div className="col-8 px-2">
                          <h5 className="mb-1">{item.nome}</h5>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="col-6 col-md-2 col-qty d-flex justify-content-center align-items-center">
                    <Button
                      className="quantity-btn me-1"
                      variant="outline-light"
                      size="sm"
                      onClick={() => aggiornaQuantita(item.id, item.qty - 1)}
                      disabled={item.qty === 1}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </Button>
                    <span>x {item.qty}</span>
                    <Button
                      className="quantity-btn ms-1"
                      variant="outline-light"
                      size="sm"
                      onClick={() => aggiornaQuantita(item.id, item.qty + 1)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </Button>
                  </div>

                  <div className="col-6 col-md-2 col-price text-end">
                    <p className="mb-0 fw-bold">
                      € {(item.prezzo * item.qty).toFixed(2)}
                    </p>
                  </div>

                  <div className="col-md-1 col-trash text-end">
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => rimuoviDalCarrello(item.id)}
                    >
                      <i className="fas fa-trash fa-lg"></i>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Right column - Order summary */}
        <Col lg={4}>
          <Card className="bg-dark text-white p-4">
            <h4 className="mb-4">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>{calculateSubtotal().toFixed(2)} €</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>{calculateShipping().toFixed(2)} €</span>
            </div>
            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
              <strong>Total</strong>
              <strong>{calculateTotal().toFixed(2)} €</strong>
            </div>
            {calculateSubtotal() > 0 && calculateShipping() > 0 && (
              <small className="text-muted d-block mt-2">
                Free shipping for orders over €{SOGLIA_SPEDIZIONE}
              </small>
            )}
            <Link to="/checkout" className="btn btn-outline-light w-100 mt-3">
              Checkout
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
