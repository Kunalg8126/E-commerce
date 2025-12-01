import db from "../config/db.js";

// ---------------------------------------------------
// 1) Get all products
// ---------------------------------------------------
export const getProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  db.query(sql)
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ---------------------------------------------------
// 2) Search product (by name or category)
// ---------------------------------------------------
export const searchProducts = (req, res) => {
  const query = req.query.query;

  const sql = `
    SELECT * FROM products
    WHERE LOWER(name) LIKE LOWER($1)
    OR LOWER(category) LIKE LOWER($2)
  `;

  db.query(sql, [`%${query}%`, `%${query}%`])
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ---------------------------------------------------
// 3) Get all categories
// ---------------------------------------------------
export const getCategories = (req, res) => {
  const sql = "SELECT DISTINCT category FROM products";

  db.query(sql)
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};

// ---------------------------------------------------
// 4) AUTOCOMPLETE SUGGESTIONS
// ---------------------------------------------------
export const getSuggestions = (req, res) => {
  const query = req.query.query;

  if (!query || query.trim() === "") {
    return res.json([]);
  }

  const sql = `
    SELECT name FROM products
    WHERE LOWER(name) LIKE LOWER($1)
    LIMIT 5
  `;

  db.query(sql, [`%${query}%`])
    .then((result) => res.json(result.rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};
