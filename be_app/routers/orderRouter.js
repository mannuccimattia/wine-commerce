const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const transporter = require("../config/emailConfig");
const createEmailTemplate = require("../templates/orderConfirmation");
const connection = require("../data/db");

// UTIL: Inserimento ordine e items
const insertOrder = (req, res, status = "stripe_completed") => {
  const cliente = req.body.cliente;
  const carrello = req.body.carrello;
  const shipping_price = req.body.shippingCost || 0;
  const amount = req.body.subtotale || 0;
  const user_id = req.body.user_id || 1;

  const sql = `INSERT INTO orders (amount, user_id, shipping_price, first_name, last_name, email, address, city, zip_code, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  connection.query(
    sql,
    [
      amount,
      user_id,
      shipping_price,
      cliente.firstName,
      cliente.lastName,
      cliente.email,
      cliente.address,
      cliente.city,
      cliente.zip_code,
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Errore inserimento ordine:", err);
        return res
          .status(500)
          .json({ message: "Errore nel salvataggio dell'ordine" });
      }

      const orderId = result.insertId;
      let inseriti = 0;

      if (!carrello || carrello.length === 0) {
        return res.status(200).json({
          message: "Ordine ricevuto, nessun item da inserire",
          ordineRicevuto: orderId,
        });
      }

      carrello.forEach((item) => {
        connection.query(
          `INSERT INTO order_items (order_id, wine_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, item.id, item.qty, parseFloat(item.prezzo)],
          () => {
            inseriti++;
            if (inseriti === carrello.length) {
              res.status(200).json({
                message: "Ordine e item inseriti correttamente!",
                ordineRicevuto: orderId,
              });
            }
          }
        );
      });
    }
  );
};

// POST /order
router.post("/", (req, res) => {
  // Status sempre stripe_completed indipendentemente dal metodo di pagamento
  insertOrder(req, res, "stripe_completed");
});

// Create Stripe checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, shippingCost } = req.body;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name || item.nome,
        },
        unit_amount: Math.round(item.prezzo * 100),
      },
      quantity: item.qty,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Spedizione",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FE_URL || "http://localhost:5173"}/success`,
      cancel_url: `${process.env.FE_URL || "http://localhost:5173"}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Errore Stripe:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rotta migliorata per l'invio dell'email di conferma
router.post("/send-confirmation", async (req, res) => {
  console.log("=== INIZIO INVIO EMAIL CONFERMA ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Body ricevuto:", JSON.stringify(req.body, null, 2));

  const { cartItems, shippingCost, customerEmail, customerDetails, orderID } =
    req.body;

  try {
    // Validazione dati in ingresso
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("❌ cartItems mancanti o non validi:", cartItems);
      return res.status(400).json({
        error: "cartItems mancanti o non validi",
        received: cartItems,
      });
    }

    if (!customerEmail) {
      console.error("❌ customerEmail mancante");
      return res.status(400).json({
        error: "customerEmail mancante",
        received: customerEmail,
      });
    }

    if (!customerDetails) {
      console.error("❌ customerDetails mancanti");
      return res.status(400).json({
        error: "customerDetails mancanti",
        received: customerDetails,
      });
    }

    // Calcolo totale
    const total =
      cartItems.reduce((acc, item) => {
        const prezzo =
          typeof item.prezzo === "string"
            ? parseFloat(item.prezzo)
            : item.prezzo;
        return acc + prezzo * item.qty;
      }, 0) + (shippingCost || 0);

    console.log("💰 Totale calcolato:", total);

    // Preparazione dati per il template email
    const templateData = {
      cartItems: cartItems.map((item) => ({
        ...item,
        name: item.name || item.nome, // Assicura che ci sia sempre 'name'
        prezzo:
          typeof item.prezzo === "string"
            ? parseFloat(item.prezzo)
            : item.prezzo,
      })),
      shippingCost: shippingCost || 0,
      total: total,
      customerEmail,
      customerDetails,
      orderID: orderID || `ORDER-${Date.now()}`,
    };

    console.log(
      "📧 Dati per template email:",
      JSON.stringify(templateData, null, 2)
    );

    // Creazione contenuto email
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation #${templateData.orderID} - Bool Wines`,
      html: createEmailTemplate(templateData),
    };

    console.log("📩 Configurazione email:");
    console.log("- From:", emailContent.from);
    console.log("- To:", emailContent.to);
    console.log("- Subject:", emailContent.subject);

    // Invio email
    const info = await transporter.sendMail(emailContent);

    console.log("✅ Email inviata con successo!");
    console.log("- Message ID:", info.messageId);
    console.log("- Response:", info.response);
    console.log("- Accepted:", info.accepted);
    console.log("- Rejected:", info.rejected);

    res.status(200).json({
      message: "Email inviata con successo",
      orderID: templateData.orderID,
      emailInfo: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      },
    });
  } catch (error) {
    console.error("❌ ERRORE INVIO EMAIL:");
    console.error("- Message:", error.message);
    console.error("- Stack:", error.stack);
    console.error("- Code:", error.code);

    res.status(500).json({
      error: "Errore nell'invio dell'email",
      details: error.message,
      code: error.code || "UNKNOWN_ERROR",
    });
  }
});

// Test email
router.post("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Se la ricevi, tutto funziona! 🍷",
    });
    res.json({ message: "Test email inviata" });
  } catch (error) {
    console.error("Errore test email:", error);
    res.status(500).json({ error: error.message });
  }
});

// 1. VERIFICA CONFIGURAZIONE EMAIL
router.post("/debug-email-config", async (req, res) => {
  console.log("=== DEBUG EMAIL CONFIGURATION ===");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

  try {
    // Test connessione SMTP
    await transporter.verify();
    console.log("✅ Connessione SMTP verificata con successo");
    res.json({
      status: "success",
      message: "Configurazione email OK",
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
      },
    });
  } catch (error) {
    console.error("❌ Errore verifica SMTP:", error);
    res.status(500).json({
      status: "error",
      message: "Configurazione email NON OK",
      error: error.message,
    });
  }
});

// 2. TEST EMAIL SEMPLIFICATO
router.post("/test-simple-email", async (req, res) => {
  try {
    console.log("=== INVIO EMAIL DI TEST ===");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email || process.env.EMAIL_USER, // Email di test
      subject: "Test Email - " + new Date().toISOString(),
      text: "Questo è un test email semplice",
      html: "<h1>Test Email</h1><p>Se ricevi questa email, la configurazione funziona!</p>",
    });

    console.log("✅ Email inviata:");
    console.log("- Message ID:", info.messageId);
    console.log("- Response:", info.response);
    console.log("- Accepted:", info.accepted);
    console.log("- Rejected:", info.rejected);
    console.log("- Pending:", info.pending);

    res.json({
      message: "Email di test inviata",
      info: {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      },
    });
  } catch (error) {
    console.error("❌ Errore invio email test:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
