import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import pool from "../config/db.js"; // PostgreSQL connection

const router = express.Router();

// CREATE RAZORPAY INSTANCE
const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY,
key_secret: process.env.RAZORPAY_SECRET,
});

// ---------------------- CREATE ORDER ----------------------
router.post("/create-order", async (req, res) => {
try {
const { amount } = req.body;


if (!amount) 
  return res.status(400).json({ success: false, message: "Amount is required" });

const options = {
  amount: amount * 100, // rupees → paise
  currency: "INR",
  receipt: "order_rcpt_" + Date.now(),
};

const order = await razorpay.orders.create(options);

res.json({
  success: true,
  key: process.env.RAZORPAY_KEY,
  order,
});


} catch (error) {
console.error("Create Order Error:", error);
res.status(500).json({ success: false, message: error.message });
}
});

// ---------------------- VERIFY PAYMENT AND SAVE ORDER ----------------------
router.post("/verify", async (req, res) => {
try {
const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address, amount, user_id } = req.body;


if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
  return res.status(400).json({ success: false, message: "Incomplete payment details" });
}

// Verify signature
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(body)
  .digest("hex");

if (expectedSignature !== razorpay_signature) {
  return res.status(400).json({ success: false, message: "Payment verification failed" });
}

// Save order in DB
const query = `
  INSERT INTO orders (user_id, order_id, payment_id, signature, amount, name, mobile, address, city, state, pincode)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
  RETURNING *
`;

const values = [
  user_id || null,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  amount || 99900, // amount in paise
  address.name,
  address.mobile,
  address.address,
  address.city,
  address.state,
  address.pincode,
];

const result = await pool.query(query, values);

res.json({
  success: true,
  order_id: razorpay_order_id,
  payment_id: razorpay_payment_id,
  signature: razorpay_signature,
  amount: amount || 99900,
  order_db: result.rows[0],
});


} catch (err) {
console.error("Verify Payment Error:", err);
res.status(500).json({ success: false, message: "Payment verification failed" });
}
});

export default router;
