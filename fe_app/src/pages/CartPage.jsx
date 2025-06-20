import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";





const CartPage = () => {
  // Stato per gestire gli elementi del carrello
  const [cartItems, setCartItems] = useState([]);
  const SPESE_SPEDIZIONE = 8.9;
  const SOGLIA_SPEDIZIONE = 300;
  const navigate = useNavigate();
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // Al mount del componente, carica il carrello dal localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("carrello")) || [];
    setCartItems(cart);
  }, []);

  /**
   * Aggiorna la quantità di un prodotto nel carrello
   * @param {number} itemId - ID del prodotto da aggiornare
   * @param {number} newQuantity - Nuova quantità da impostare
   */
  const updateQuantity = (itemId, newQuantity) => {
    // Verifica che la quantità non sia inferiore a 1
    if (newQuantity < 1) return;

    // Crea un nuovo array con la quantità aggiornata
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, qty: newQuantity } : item
    );

    // Calcola il nuovo subtotale
    const subtotale = updatedCart.reduce((acc, item) => {
      return acc + item.qty * (item.prezzo || 0);
    }, 0);

    // Aggiorna lo stato e il localStorage
    setCartItems(updatedCart);
    localStorage.setItem("carrello", JSON.stringify(updatedCart));
    localStorage.setItem("subtotale", subtotale.toFixed(2));
  };

  /**
   * Rimuove un prodotto dal carrello
   * @param {number} itemId - ID del prodotto da rimuovere
   */
  const removeItem = (itemId) => {
    // Filtra l'array rimuovendo l'elemento selezionato
    const updatedCart = cartItems.filter((item) => item.id !== itemId);

    // Ricalcola il subtotale
    const subtotale = updatedCart.reduce((acc, item) => {
      return acc + item.qty * (item.prezzo || 0);
    }, 0);

    // Aggiorna lo stato e il localStorage
    setCartItems(updatedCart);
    localStorage.setItem("carrello", JSON.stringify(updatedCart));
    localStorage.setItem("subtotale", subtotale.toFixed(2));
  };

  /**
   * Calcola il subtotale del carrello
   * @returns {number} Subtotale calcolato
   */
  const calculateSubtotal = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.qty * item.prezzo,
      0
    );
    localStorage.setItem("subtotale", subtotal.toFixed(2));
    return subtotal;
  };

  /**
   * Calcola le spese di spedizione in base al subtotale
   * @returns {number} Spese di spedizione calcolate
   */
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > SOGLIA_SPEDIZIONE ? 0 : SPESE_SPEDIZIONE;
  };

  /**
   * Calcola il totale dell'ordine
   * @returns {number} Totale calcolato
   */
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    return subtotal + shipping;
  };

  // Rendering condizionale per carrello vuoto
  if (cartItems.length === 0) {
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

  // Rendering principale del carrello
  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Carrello</h2>
      <Row>
        {/* Colonna sinistra - Lista prodotti */}
        <Col lg={8}>
          {cartItems.map((item) => (
            <Card key={item.id} className="mb-3 bg-dark text-white">
              <Card.Body>
                <Row className="align-items-center">
                  {/* Nome prodotto */}
                  <Col xs={9} md={6}>
                    <div className="d-flex align-items-center">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.nome}
                          onClick={() => navigate(`/wine/${item.id}`)}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginRight: "15px",
                            borderRadius: "4px",
                            cursor: 'pointer'
                          }}
                        />
                      )}
                      <span
                        style={{ color: 'inherit', cursor: 'pointer', textDecoration: hoveredItemId === item.id ? 'underline' : 'none' }}
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        onClick={() => navigate(`/wine/${item.id}`)}
                      >
                        <h5 className="mb-0">{item.nome}</h5>
                      </span>
                    </div>
                  </Col>

                  {/* Controlli quantità */}
                  <Col xs={6} md={3} className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                      >
                        -
                      </Button>
                      <span className="mx-3">{item.qty}</span>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </Col>

                  {/* Prezzo totale per prodotto */}
                  <Col xs={6} md={2} className="text-end">
                    <p className="mb-0">
                      € {(item.prezzo * item.qty).toFixed(2)}
                    </p>
                  </Col>

                  {/* Pulsante rimozione */}
                  <Col xs={12} md={1} className="text-end">
                    <Button
                      variant="link"
                      className="text-white p-2"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Colonna destra - Riepilogo ordine */}
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
