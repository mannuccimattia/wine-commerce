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
          console.error("Nessun dato ordine trovato");
          setError("Nessun dato ordine trovato.");
          return;
        }

        processedRef.current = true;

        // 1. INSERIMENTO ORDINE
        const orderPayload = {
          cliente: orderData.customerDetails,
          carrello: orderData.cartItems,
          subtotale: parseFloat(orderData.subtotale.toFixed(2)),
          shippingCost: parseFloat(orderData.shippingCost.toFixed(2)),
        };

        console.log("Invio ordine a backend con payload:", orderPayload);
        const orderResponse = await axios.post(
          "http://localhost:3000/api/order",
          orderPayload
        );
        console.log("Risposta backend ordine:", orderResponse.data);

        // 2. INVIO EMAIL
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

        console.log("Dati email da inviare:", emailPayload);

        const emailResponse = await axios.post(
          "http://localhost:3000/api/order/send-confirmation",
          emailPayload
        );

        console.log("Risposta backend email completa:", emailResponse);

        if (emailResponse.status === 200 && emailResponse.data) {
          console.log("✅ Email inviata con successo");
          setOrderProcessed(true);
          svuotaCarrello();
          localStorage.removeItem("orderData");
        } else {
          console.error("❌ Risposta email non valida:", emailResponse);
          setError("C'è stato un problema nell'invio dell'email.");
        }
      } catch (error) {
        console.error("Errore durante l'elaborazione dell'ordine:", error);
        setError("C'è stato un problema nell'elaborazione dell'ordine.");
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
      }, 5000); // Ridotto a 5 secondi per test
      return () => clearTimeout(timer);
    }
  }, [sending, navigate]);

  return (
    <Container className="py-5">
      <Card className="bg-dark text-white p-5 text-center">
        {sending ? (
          // Mostra solo il loader
          <>
            <i
              className="fas fa-spinner fa-spin text-warning mb-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mb-4">Attendi mentre l'ordine viene elaborato...</h2>
            <p className="text-muted mb-4">
              Non chiudere la pagina. Stiamo completando il tuo ordine.
            </p>
          </>
        ) : error ? (
          // Mostra il messaggio di errore solo se presente
          <>
            <i
              className="fas fa-times-circle text-danger mb-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mb-4">Errore nell'elaborazione dell'ordine</h2>
            <p className="mb-4">{error}</p>
            <p className="text-muted mb-4">
              Verrai reindirizzato alla home page tra pochi secondi...
            </p>
          </>
        ) : (
          // Mostra il messaggio di successo
          <>
            <i
              className="fas fa-check-circle text-success mb-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <h2 className="mb-4">Ordine Completato con Successo!</h2>
            <p className="mb-4">
              Il tuo ordine è stato salvato e la conferma è stata inviata alla
              tua email.
            </p>
            <p className="text-muted mb-4">
              Verrai reindirizzato alla home page tra pochi secondi...
            </p>
          </>
        )}

        <Link to="/" className="btn btn-outline-light">
          Torna alla Home
        </Link>
      </Card>
    </Container>
  );
};

export default SuccessPage;
