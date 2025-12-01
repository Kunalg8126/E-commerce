import express from "express";
import { getProducts, searchProducts, getCategories, getSuggestions } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/categories", getCategories);
router.get("/suggestions", getSuggestions);

export default router;
