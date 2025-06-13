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

  const initialCart = JSON.parse(localStorage.getItem("carrello"))
    ? JSON.parse(localStorage.getItem("carrello"))
    : [];

  console.log(initialCart);
}


/* 
const data = []
const myData = {id:1, quantity:1, ppu:100}
data.push(myData)

localStorage.setItem("carrello", JSON.stringify(data));

const carrello = JSON.parse(localStorage.getItem("carrello"));

const myData2 = {id:2,quantity:2,ppu:200};
carrello.push(myData2)

localStorage.setItem("carrello", JSON.stringify(carrello));
const finalData = JSON.parse(localStorage.getItem("carrello"))

console.log(finalData) */

const storeCartItem = (req, res) => {

  // store item into cart route
  const initialCart = JSON.parse(localStorage.getItem("carrello"))
    ? JSON.parse(localStorage.getItem("carrello"))
    : [];

  const { id } = req.params;

  const item = {
    id,
    quantity: 1,
    ppu: 100
  }

  if (initialCart.length === 0) {
    localStorage.setItem("carrello", JSON.stringify(item));

    const carrello = JSON.parse(localStorage.getItem("carrello"));
    console.log(carrello)
  }
  else {
    initialCart.push(item);
    console.log(initialCart);
    localStorage.setItem("carrello", JSON.stringify(initialCart));
  }
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
  indexCart,
  storeCartItem,
  emptyCart
}