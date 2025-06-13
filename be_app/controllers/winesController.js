// import db
const connection = require("../data/db");

// import function queryFailed
const queryFailed = require("../functions/queryFailed");

// index
const index = (req, res) => {
  console.log(req.query)

  const sql = (
    !req.query.search
      ? "SELECT * FROM wines"
      : "SELECT * FROM wines WHERE name LIKE '%" + req.query.search + "%'"
  );

  connection.query(sql, (err, winesResult) => {
    if (err) return queryFailed(err, res);
    const wines = winesResult.map(wine => {
      const win = {
        ...wine,
        image_front_url: req.imagePath + wine.image_front_url,
        image_back_url: req.imagePath + wine.image_back_url
      };

      return win;
    });

    res.json(wines);
  })
}

// show
const show = (req, res) => {
  const { id } = req.params;

  const wineSql = `
  SELECT *
  FROM wines W
  WHERE W.id = ?`;

  // wines query
  connection.query(wineSql, [id], (err, wineResult) => {
    if (err) return queryFailed(err, res);
    if (wineResult.length === 0 || wineResult[0].id === null)
      return res.status(404).json({
        error: "Wine not Found"
      });
    const wine = wineResult[0];

    res.json({
      ...wine,
      image_front_url: req.imagePath + wine.image_front_url,
      image_back_url: req.imagePath + wine.image_back_url
    });
  })
}

// index cart
const indexCart = (req, res) => {

  const indexCartSql = `
  SELECT * FROM cart
  `;


}


// store item into cart route
const storeCartItem = (req, res) => {

  const { id } = req.params;
  const { quantity, ppu } = req.body;

  const storeCartItemSql = `
  INSERT INTO cart (wine_id, quantity, price)
  VALUES (?,?,?)
  `;

  connection.query(storeCartItemSql, [id, quantity, ppu], (err, itemResult) => {
    if (err) return queryFailed(err, res);

    res.status(201).json({
      message: "Added to cart",
      id: itemResult.insertId
    });
  })
}

// delete all from cart route
const emptyCart = (req, res) => {
  const emptyCartSql = `
  DELETE FROM cart 
  `;

  connection.query(emptyCartSql, (err, emptyResult) => {
    if (err) return queryFailed(err, res);

    res.status(200).json({ message: "Cart emptied" });
  })
}

module.exports = {
  index,
  show,
  storeCartItem,
  emptyCart
}