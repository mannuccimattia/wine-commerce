// import db
const connection = require("../data/db");

// import function queryFailed
const queryFailed = require("../functions/queryFailed");

// import function wineFormat
const wineFormat = require("../functions/wineFormat");

// sql base 
const sqlBase = `
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
`;

// index
const index = (req, res) => {

  // Estrazione parametri dalla query
  const searchTerm = req.query.search?.trim();
  const categoryId = req.query.category ? parseInt(req.query.category) : null;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
  const sortBy = req.query.sortBy;
  const denomination = req.query.denomination?.trim();
  const region = req.query.region?.trim();

  // Costruzione condizioni WHERE
  let whereConditions = [];
  let queryParams = [];

  // Ricerca testuale (name, vintage, winemaker)
  if (searchTerm) {
    whereConditions.push(
      `(W.name LIKE ? OR W.vintage LIKE ? OR WN.name LIKE ?)`
    );
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
  }

  // Filtro categoria
  if (categoryId && categoryId !== "all") {
    whereConditions.push(`W.category = ?`);
    queryParams.push(categoryId);
  }

  // Filtro prezzo minimo
  if (minPrice !== null && minPrice > 0) {
    whereConditions.push(`W.price >= ?`);
    queryParams.push(minPrice);
  }

  // Filtro prezzo massimo
  if (maxPrice !== null && maxPrice > 0) {
    whereConditions.push(`W.price <= ?`);
    queryParams.push(maxPrice);
  }

  // Filtro denominazione
  if (denomination) {
    whereConditions.push(`D.name = ?`);
    queryParams.push(denomination);
  }

  // Filtro regione
  if (region) {
    whereConditions.push(`R.name = ?`);
    queryParams.push(region);
  }

  // Costruzione query completa
  let sql = sqlBase;
  if (whereConditions.length > 0) {
    sql += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  // Gestione ordinamento
  let orderBy = "W.id ASC"; // Default fallback

  switch (sortBy) {
    case "price-asc":
      orderBy = "W.price ASC";
      break;
    case "price-desc":
      orderBy = "W.price DESC";
      break;
    case "year-asc":
      orderBy = "W.vintage ASC";
      break;
    case "year-desc":
      orderBy = "W.vintage DESC";
      break;
    case "name-asc":
      orderBy = "W.name ASC";
      break;
    case "name-desc":
      orderBy = "W.name DESC";
      break;
    default:
      // Se non è specificato nessun ordinamento, ordina per rilevanza
      if (searchTerm) {
        orderBy = "W.name ASC"; // Ordina per nome quando c'è una ricerca
      } else {
        orderBy = "W.id DESC"; // Ordina per ID (più recenti primi) quando non c'è ricerca
      }
  }

  sql += ` ORDER BY ${orderBy}`;

  // Debug logging (rimuovi in produzione)
  console.log("Query SQL:", sql);
  console.log("Parametri:", queryParams);
  console.log("Filtri applicati:", {
    searchTerm,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    denomination,
    region,
  });

  // Esecuzione query
  connection.query(sql, queryParams, (err, winesResult) => {
    if (err) {
      console.error("Errore query:", err);
      return queryFailed(err, res);
    }

    // Mappatura risultati
    const wines = winesResult.map(wine => wineFormat(wine, req));

    // Risposta
    res.status(200).json(wines);
  });
};

module.exports = { index };

// show
const show = (req, res) => {
  const { id } = req.params;

  const wineSql = `${sqlBase} WHERE W.id = ?`;

  connection.query(wineSql, [id], (err, wineResult) => {
    if (err) return queryFailed(err, res);

    if (wineResult.length === 0) {
      return res.status(404).json({ error: "Wine not found" });
    }

    const wine = wineResult[0];

    res.json(wineFormat(wine, req));
  });
};

// get best sellers
const getBestSellers = (req, res) => {
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

    const wines = winesResult.map(wine => wineFormat(wine, req));

    res.json(wines);
  });
};

//get wines from category id
const getWineFromCategory = (req, res) => {
  const categoryID = req.params.id;

  const sql = `
  ${sqlBase}
  WHERE C.id = ?
  ORDER BY W.price ASC
  `;

  connection.query(sql, [categoryID], (err, winesResult) => {
    if (err) return queryFailed(err, res);

    const wines = winesResult.map(wine => wineFormat(wine, req));

    res.json(wines);
  });
};

// Premium Vintage
const premiumVintage = (req, res) => {
  const premiumVintageSql = `
    ${sqlBase}
    JOIN (
      SELECT category, MAX(price) AS max_price
      FROM wines
      WHERE category IS NOT NULL
      GROUP BY category
    ) AS max_wines ON W.category = max_wines.category AND W.price = max_wines.max_price
  `;

  connection.query(premiumVintageSql, (err, winesResult) => {
    if (err) return queryFailed(err, res);

    const wines = winesResult.map(wine => wineFormat(wine, req));

    res.json(wines);
  });
};

//GET CATEGORIES
const getCategories = (req, res) => {
  const sql = "SELECT id, name, color FROM categories ORDER BY id";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Errore nella query getCategories:", err);
      return res.status(500).json({ message: "Errore nel recupero categorie" });
    }
    res.json(results);
  });
};

// GET DENOMINATIONS
const getDenominations = (req, res) => {
  const sql = "SELECT id, name FROM denominations ORDER BY id";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Errore nella query getDenominations:", err);
      return res
        .status(500)
        .json({ message: "Errore nel recupero denominazioni" });
    }
    res.json(results);
  });
};

// GET REGIONS
const getRegions = (req, res) => {
  const sql = "SELECT id, name FROM regions ORDER BY id";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Errore nella query getRegions:", err);
      return res.status(500).json({ message: "Errore nel recupero regioni" });
    }
    res.json(results);
  });
};

module.exports = {
  index,
  show,
  getBestSellers,
  getWineFromCategory,
  premiumVintage,
  getCategories,
  getDenominations,
  getRegions,
};
