const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const transporter = require('../config/emailConfig');

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
    const { cartItems, shippingCost, customerEmail } = req.body;
    console.log('Received order data:', { cartItems, shippingCost, customerEmail });

    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.nome || 'Wine',
        },
        unit_amount: Math.round(item.prezzo * 100), // Convert to cents
      },
      quantity: item.qty
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FE_URL || 'http://localhost:5173'}/success`,
      cancel_url: `${process.env.FE_URL || 'http://localhost:5173'}/cart`,
    });

    // Send confirmation email
    console.log('Attempting to send email to:', customerEmail);

    const emailContent = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Conferma Ordine - Bool Wines',
      html: `
                <h2>Grazie per il tuo ordine!</h2>
                <p>Abbiamo ricevuto il tuo ordine e lo stiamo elaborando.</p>
                <h3>Dettagli Ordine:</h3>
                <ul>
                    ${cartItems.map(item => `
                        <li>${item.nome} - Quantità: ${item.qty} - €${(item.prezzo * item.qty).toFixed(2)}</li>
                    `).join('')}
                </ul>
                <p>Spese di spedizione: €${shippingCost.toFixed(2)}</p>
                <p>Totale: €${(cartItems.reduce((acc, item) => acc + (item.prezzo * item.qty), 0) + shippingCost).toFixed(2)}</p>
            `
    };

    await transporter.sendMail(emailContent)
      .then(() => console.log('Email sent successfully'))
      .catch(err => console.error('Email sending failed:', err));

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
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
      text: "If you receive this, email sending is working!"
    });
    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("Test email failed:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
