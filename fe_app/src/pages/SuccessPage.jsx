import React, { useEffect, useState, useRef } from "react";
import { Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCarrello } from "../contexts/CartContext";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [sending, setSending] = useState(true);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [error, setError] = useState(null);
  const processedRef = useRef(false);

  const { svuotaCarrello } = useCarrello();

  useEffect(() => {
    const processOrder = async () => {
      if (processedRef.current) {
        setSending(false);
        return;
      }

      try {
        const orderData = JSON.parse(localStorage.getItem("orderData"));
        if (!orderData) {
          console.error("No order data found");
          setError("No order data found.");
          return;
        }

        processedRef.current = true;

        // 1. INSERT ORDER
        const orderPayload = {
          cliente: orderData.customerDetails,
          carrello: orderData.cartItems,
          subtotale: parseFloat(orderData.subtotale.toFixed(2)),
          shippingCost: parseFloat(orderData.shippingCost.toFixed(2)),
        };

        console.log("Sending order to backend with payload:", orderPayload);
        const orderResponse = await axios.post(
          "http://localhost:3000/api/order",
          orderPayload
        );
        console.log("Backend order response:", orderResponse.data);

        // 2. SEND EMAIL
        const emailPayload = {
          cartItems: orderData.cartItems.map((item) => ({
            name: item.nome,
            prezzo: parseFloat(item.prezzo),
            qty: item.qty,
          })),
          shippingCost: parseFloat(orderData.shippingCost),
          customerEmail: orderData.customerEmail,
          customerDetails: orderData.customerDetails,
          orderID: orderResponse.data.ordineRicevuto || `ORDER-${Date.now()}`,
        };

        console.log("Email data to send:", emailPayload);

        const emailResponse = await axios.post(
          "http://localhost:3000/api/order/send-confirmation",
          emailPayload
        );

        console.log("Backend email response:", emailResponse);

        if (emailResponse.status === 200 && emailResponse.data) {
          console.log("✅ Email sent successfully");
          setOrderProcessed(true);
          svuotaCarrello();
          localStorage.removeItem("orderData");
        } else {
          console.error("❌ Invalid email response:", emailResponse);
          setError("There was a problem sending the email.");
        }
      } catch (error) {
        console.error("Error processing order:", error);
        setError("There was a problem processing your order.");
      } finally {
        setSending(false);
      }
    };

    processOrder();
  }, []);

  useEffect(() => {
    if (!sending) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000); // Reduced to 5 seconds for testing
      return () => clearTimeout(timer);
    }
  }, [sending, navigate]);

  return (
    <Container className="py-5">
      <Card className="bg-dark text-white p-5 text-center">
        {sending ? (
          // Show only the loader
          <>
            <i
              className="fas fa-spinner fa-spin text-warning mb-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mb-4">
              Please wait while your order is being processed...
            </h2>
            <p className="text-muted mb-4">
              Do not close this page. We are completing your order.
            </p>
          </>
        ) : error ? (
          // Show error message only if present
          <>
            <i
              className="fas fa-times-circle text-danger mb-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mb-4">Error processing your order</h2>
            <p className="mb-4">{error}</p>
            <p className="text-muted mb-4">
              You will be redirected to the homepage shortly...
            </p>
          </>
        ) : (
          // Show success message
          <>
            <i
              className="fas fa-check-circle text-success mb-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mb-4">Order Completed Successfully!</h2>
            <p className="mb-4">
              Your order has been saved and the confirmation has been sent to
              your email.
            </p>
            <p className="text-muted mb-4">
              You will be redirected to the homepage shortly...
            </p>
          </>
        )}

        <Link to="/" className="btn btn-outline-light">
          Back to Home
        </Link>
      </Card>
    </Container>
  );
};

export default SuccessPage;
