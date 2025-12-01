import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/productCartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:email", getCart);  // user email via params
router.post("/remove", removeFromCart);

export default router;
