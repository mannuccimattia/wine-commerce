const express = require("express");
const router = express.Router();
const connection = require("../data/db");

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

module.exports = router;
