import React, { useState, useEffect } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const CartSidebar = () => {
  const [show, setShow] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  // Mostra la sidebar ogni volta che cambia il localStorage del carrello
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("carrello")) || [];
      setCartItems(updatedCart);

      if (updatedCart.length > 0) {
        setShow(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Per montaggio iniziale

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location]);

  return (
    <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Il tuo carrello</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length === 0 ? (
          <p>Il carrello è vuoto.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="mb-3">
              <strong>{item.nome}</strong> x {item.qty}<br />
              €{(item.prezzo * item.qty).toFixed(2)}
              <hr />
            </div>
          ))
        )}
        <Button variant="dark" href="/cart" className="w-100 mt-3">
          Vai al carrello
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;
