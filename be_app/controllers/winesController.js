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

  const reviewsSql = `
  SELECT *
  FROM user_review R
  WHERE R.wine_id = ?
  `

  // wines query
  connection.query(wineSql, [id], (err, wineResult) => {
    if (err) return queryFailed(err, res);
    if (wineResult.length === 0 || wineResult[0].id === null)
      return res.status(404).json({
        error: "Wine not Found"
      });
    const wine = wineResult[0];

    // reviews query
    connection.query(reviewsSql, [id], (err, reviewsResult) => {
      if (err) return queryFailed(err, res);
      wine.reviews = reviewsResult;

      res.json({ ...wine, image: req.imagePath + wine.image });
    })
  })
}

// store review
const storeReview = (req, res) => {
  const { id } = req.params;

  const { review_text, full_name, email, rating } = req.body;

  const sql = `
  INSERT INTO reviews (review_text, full_name, email, rating, wine_id)
  VALUES (?,?,?,?,?)
  `;

  connection.query(sql, [review_text, full_name, email, rating, id], (err, reviewResult) => {
    if (err) return queryFailed(err, res);

    res.status(201).json({
      message: "Review added successfully",
      id: reviewResult.insertId
    });
  });
};

module.exports = {
  index,
  show,
  storeReview
}