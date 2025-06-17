// import db
const connection = require("../data/db");

// import function queryFailed
const queryFailed = require("../functions/queryFailed");

// index
const index = (req, res) => {
  const sql = !req.query.search
    ? sqlAll
    : sqlAll + "WHERE name LIKE '%" + req.query.search + "%'";

  connection.query(sql, (err, winesResult) => {
    if (err) return queryFailed(err, res);
    const wines = winesResult.map((wine) => {
      const win = {
        id: wine.id,
        name: wine.name,
        category: {
          id: wine.category,
          name: wine.category_name,
        },
        price: wine.price,
        alcol: wine.alcol,
        bottle_size: wine.bottle_size,
        vintage: wine.vintage,
        stock: wine.stock,
        image_front_url: req.imagePath + wine.image_front_url,
        image_back_url: req.imagePath + wine.image_back_url,
      };

      return win;
    });

    res.json(wines);
  });
};

// show
const show = (req, res) => {
  const { id } = req.params;

  const wineSql = `
    SELECT 
      W.*,
      D.name AS denomination_name,
      C.name AS category_name,
      R.name AS region_name,
      WN.name AS winemaker_name,
      LC.name AS label_condition_name,
      LC.rating AS label_condition_rating,
      BC.name AS bottle_condition_name,
      BC.rating AS bottle_condition_rating
    FROM wines W
    LEFT JOIN denominations D ON W.denomination = D.id
    LEFT JOIN categories C ON W.category = C.id
    LEFT JOIN regions R ON W.region = R.id
    LEFT JOIN winemakers WN ON W.winemaker = WN.id
    LEFT JOIN label_conditions LC ON W.label_condition = LC.id
    LEFT JOIN bottle_conditions BC ON W.bottle_condition = BC.id
    WHERE W.id = ?
  `;

  connection.query(wineSql, [id], (err, wineResult) => {
    if (err) return queryFailed(err, res);

    if (wineResult.length === 0) {
      return res.status(404).json({ error: "Wine not found" });
    }

    const wine = wineResult[0];

    res.json({
      id: wine.id,
      name: wine.name,
      category: {
        id: wine.category,
        name: wine.category_name,
      },
      price: wine.price,
      alcol: wine.alcol,
      bottle_size: wine.bottle_size,
      vintage: wine.vintage,
      stock: wine.stock,
      image_front_url: req.imagePath + wine.image_front_url,
      image_back_url: req.imagePath + wine.image_back_url,
      grape_type: wine.grape_type,
      label_condition: {
        id: wine.label_condition,
        name: wine.label_condition_name,
        rating: wine.label_condition_rating,
      },
      bottle_condition: {
        id: wine.bottle_condition,
        name: wine.bottle_condition_name,
        rating: wine.bottle_condition_rating,
      },
      region: {
        id: wine.region,
        name: wine.region_name,
      },
      temperature: wine.temperature,
      winemaker: {
        id: wine.winemaker,
        name: wine.winemaker_name,
      },
      description: wine.description,
      denomination: {
        id: wine.denomination,
        name: wine.denomination_name,
      },
    });
  });
};

// get best sellers
const getBestSellers = (req, res) => {
  console.log("BESTSELLER");
  const bestSellersSql = `
    SELECT 
      W.*,
      D.name AS denomination_name,
      C.name AS category_name,
      R.name AS region_name,
      WN.name AS winemaker_name,
      LC.name AS label_condition_name,
      LC.rating AS label_condition_rating,
      BC.name AS bottle_condition_name,
      BC.rating AS bottle_condition_rating,
      SUM(OI.quantity) AS total_sold
    FROM wines W
    LEFT JOIN denominations D ON W.denomination = D.id
    LEFT JOIN categories C ON W.category = C.id
    LEFT JOIN regions R ON W.region = R.id
    LEFT JOIN winemakers WN ON W.winemaker = WN.id
    LEFT JOIN label_conditions LC ON W.label_condition = LC.id
    LEFT JOIN bottle_conditions BC ON W.bottle_condition = BC.id
    INNER JOIN order_items OI ON W.id = OI.wine_id
    GROUP BY W.id
    ORDER BY total_sold DESC
    LIMIT 4
  `;

  connection.query(bestSellersSql, (err, winesResult) => {
    if (err) return queryFailed(err, res);

    const wines = winesResult.map((wine) => ({
      id: wine.id,
      name: wine.name,
      category: {
        id: wine.category,
        name: wine.category_name,
      },
      price: wine.price,
      alcol: wine.alcol,
      bottle_size: wine.bottle_size,
      vintage: wine.vintage,
      stock: wine.stock,
      image_front_url: req.imagePath + wine.image_front_url,
      image_back_url: req.imagePath + wine.image_back_url,
      grape_type: wine.grape_type,
      label_condition: {
        id: wine.label_condition,
        name: wine.label_condition_name,
        rating: wine.label_condition_rating,
      },
      bottle_condition: {
        id: wine.bottle_condition,
        name: wine.bottle_condition_name,
        rating: wine.bottle_condition_rating,
      },
      region: {
        id: wine.region,
        name: wine.region_name,
      },
      temperature: wine.temperature,
      winemaker: {
        id: wine.winemaker,
        name: wine.winemaker_name,
      },
      description: wine.description,
      denomination: {
        id: wine.denomination,
        name: wine.denomination_name,
      },
      total_sold: wine.total_sold,
    }));

    res.json(wines);
  });
};

// index cart
const indexCart = (req, res) => {
  const indexCartSql = `
  SELECT * FROM cart
  `;
};

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
      id: itemResult.insertId,
    });
  });
};

// delete all from cart route
const emptyCart = (req, res) => {
  const emptyCartSql = `
  DELETE FROM cart 
  `;

  connection.query(emptyCartSql, (err, emptyResult) => {
    if (err) return queryFailed(err, res);

    res.status(200).json({ message: "Cart emptied" });
  });
};

//get wines from category id
const getWineFromCategory = (req, res) => {
  const categoryID = req.params.id;

  const sql = `
    SELECT 
      wines.*, 
      label_conditions.rating AS label_condition_rating
    FROM wines
    LEFT JOIN label_conditions ON wines.label_condition = label_conditions.id
    WHERE wines.category = ?
  `;

  connection.query(sql, [categoryID], (err, winesResults) => {
    if (err) return queryFailed(err, res);

    const wines = winesResults.map((wine) => ({
      ...wine,
      label_condition: {
        rating: wine.label_condition_rating,
      },
      image_front_url: req.imagePath + wine.image_front_url,
      image_back_url: req.imagePath + wine.image_back_url,
    }));

    res.json(wines);
  });
};

module.exports = {
  index,
  show,
  getBestSellers,
  getWineFromCategory,
};
