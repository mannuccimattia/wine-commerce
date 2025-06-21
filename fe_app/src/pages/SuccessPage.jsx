import React, { useEffect, useState, useRef } from "react";
import { Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [sending, setSending] = useState(true);
  const emailSentRef = useRef(false); // Flag per tracciare se l'email è stata inviata

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (emailSentRef.current) {
        setSending(false);
        return;
      }

      try {
        const orderData = JSON.parse(localStorage.getItem("orderData"));
        if (!orderData) {
          setSending(false);
          return;
        }

        // Aggiungi orderID all'oggetto orderData
        const orderWithId = {
          ...orderData,
          orderID: `ORDER-${Date.now()}`, // Crea un ID univoco
        };

        emailSentRef.current = true;

        const response = await axios.post(
          "http://localhost:3000/api/order/stripe/send-confirmation",
          orderWithId
        );

        if (response.data.message === "Email inviata con successo") {
          localStorage.removeItem("orderData");
          localStorage.removeItem("carrello");
        }
      } catch (error) {
        console.error("Errore invio email:", error);
        emailSentRef.current = false;
      } finally {
        setSending(false);
      }
    };

    sendConfirmationEmail();

    // Cleanup
    return () => {
      // Non è necessario resettare emailSentRef qui perché vogliamo mantenere
      // il suo valore anche se il componente viene ri-renderizzato
    };
  }, []); // Rimuoviamo tutte le dipendenze

  useEffect(() => {
    // Redirect timer in un useEffect separato
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("orderData"));
    if (orderData) {
      // Salva l’ordine nel DB
      axios
        .post("http://localhost:3000/api/order", {
          cliente: orderData.customerDetails,
          carrello: orderData.cartItems,
          shippingCost: orderData.shippingCost,
          subtotale: orderData.cartItems.reduce(
            (acc, item) => acc + item.prezzo * item.qty,
            0
          ),
        })
        .then(() => {
          // Puoi anche inviare l’email qui, se vuoi
          localStorage.removeItem("orderData");
          localStorage.removeItem("carrello");
        });
    }
  }, []);

  return (
    <Container className="py-5">
      <Card className="bg-dark text-white p-5 text-center">
        <i
          className="fas fa-check-circle text-success mb-4"
          style={{ fontSize: "4rem" }}
        ></i>
        <h2 className="mb-4">Ordine Completato con Successo!</h2>
        <p className="mb-4">
          {sending
            ? "Stiamo inviando la conferma via email..."
            : "La conferma è stata inviata alla tua email."}
        </p>
        <p className="text-muted mb-4">
          Verrai reindirizzato alla home page tra pochi secondi...
        </p>
        <Link to="/" className="btn btn-outline-light">
          Torna alla Home
        </Link>
      </Card>
    </Container>
  );
};

export default SuccessPage;
