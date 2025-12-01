const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeItem } = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:email", getCart);
router.post("/remove", removeItem);

module.exports = router;