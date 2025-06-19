const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const transporter = require("../config/emailConfig");
const createEmailTemplate = require("../templates/orderConfirmation");

// Post order
router.post("", (req, res) => {
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
      "pending",
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
          message: "Ordine ricevuto correttamente, nessun item da inserire",
          ordineRicevuto: orderId,
        });
      }

      carrello.forEach((item) => {
        const wineId = item.id;
        const quantity = item.qty;
        const price = parseFloat(item.prezzo);

        connection.query(
          `INSERT INTO order_items (order_id, wine_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, wineId, quantity, price],
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
});

// Create Stripe checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, shippingCost } = req.body;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nome,
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

// Nuova rotta per l'invio dell'email di conferma
router.post("/send-confirmation", async (req, res) => {
  const { cartItems, shippingCost, customerEmail, customerDetails, orderID } =
    req.body;
  console.log("Richiesta invio email ricevuta:", new Date().toISOString());

  try {
    if (!cartItems || !customerEmail || !customerDetails) {
      return res.status(400).json({ error: "Dati mancanti" });
    }

    const emailContent = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Conferma Ordine #${orderID} - Bool Wines`,
      html: createEmailTemplate({
        cartItems,
        shippingCost,
        total:
          cartItems.reduce((acc, item) => acc + item.prezzo * item.qty, 0) +
          shippingCost,
        customerEmail,
        customerDetails,
      }),
    };

    await transporter.sendMail(emailContent);
    console.log(
      "Email inviata con successo a:",
      customerEmail,
      "OrderID:",
      orderID
    );

    res.json({ message: "Email inviata con successo" });
  } catch (error) {
    console.error("Errore invio email:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test email route
router.post("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "Test Email",
      text: "If you receive this, email sending is working!",
    });
    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
