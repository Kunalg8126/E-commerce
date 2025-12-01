// controllers/cartController.js
const pool = require("../db");

// 📌 Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, item } = req.body;

  try {
    // Check if user cart exists
    let cartResult = await pool.query(
      "SELECT id FROM cart WHERE user_id = $1",
      [userId]
    );

    let cartId;

    if (cartResult.rows.length === 0) {
      // Create new cart
      const newCart = await pool.query(
        "INSERT INTO cart (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Insert item
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, name, price, quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [cartId, item.id, item.name, item.price, item.quantity || 1]
    );

    res.json({ success: true, message: "Item added" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Get cart items
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await pool.query(
      `SELECT cart_items.*
       FROM cart
       JOIN cart_items ON cart.id = cart_items.cart_id
       WHERE cart.user_id = $1`,
      [userId]
    );

    res.json({ success: true, cart: cart.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { itemId } = req.body;

  try {
    await pool.query("DELETE FROM cart_items WHERE id = $1", [itemId]);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
