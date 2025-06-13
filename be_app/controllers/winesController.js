// import db
const connection = require("../data/db");

// import function queryFailed
const queryFailed = require("../functions/queryFailed");

// index
const index = (req, res) => {

  const sql = (
    !req.query.search
      ? "SELECT * FROM wines"
      : "SELECT * FROM wines WHERE name LIKE '%" + req.query.search + "%'"
  );

  connection.query(sql, (err, winesResult) => {
    if (err) return queryFailed(err, res);
    const wines = winesResult.map(wine => {
      const win = { ...wine, image: req.imagePath + wine.image };

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

module.exports = {
  index,
  show
}