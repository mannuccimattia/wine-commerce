import React, { useState, useEffect } from "react";
import { Offcanvas, Button } from "react-bootstrap";

const CartSidebar = ({ show, onHide }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (show) {
      const updatedCart = JSON.parse(localStorage.getItem("carrello")) || [];
      setCartItems(updatedCart);
    }
  }, [show]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.prezzo * item.qty,
    0
  );

  const freeShippingThreshold = 1000;
  const missingAmount = freeShippingThreshold - total;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ backgroundColor: "#121212", color: "white" }}
      backdropClassName="bg-dark bg-opacity-75"
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title style={{ color: "white" }}>
          🛒 Your cart
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body
        style={{
          backgroundColor: "#1e1e1e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          paddingBottom: "1rem",
        }}
      >
        {cartItems.length === 0 ? (
          <p style={{ color: "#bbb", fontStyle: "italic" }}>
            Your cart is empty.
          </p>
        ) : (
          <>
            <div
              style={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)" }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: "#2c2c2c",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  <strong>{item.nome}</strong> x {item.qty}
                  <br />
                  <span style={{ color: "#a88b4d", fontWeight: "600" }}>
                    €{(item.prezzo * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid #444",
                paddingTop: "1rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  color: "#a88b4d",
                  marginBottom: "0.5rem",
                  textAlign: "right",
                }}
              >
                Total: €{total.toFixed(2)}
              </div>

              {total >= freeShippingThreshold ? (
                <div
                  style={{
                    color: "#a88b4d",
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  🎉 Free shipping!
                </div>
              ) : (
                <div
                  style={{
                    color: "#a88b4d",
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  €{missingAmount.toFixed(2)} away from free shipping
                </div>
              )}

              <Button
                variant="warning"
                href="/cart"
                className="w-100"
                onClick={onHide}
                style={{ fontWeight: "600" }}
              >
                Go to cart
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;
