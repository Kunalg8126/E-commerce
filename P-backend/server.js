import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contact.js";
import cartRoutes from "./routes/cart.js";
import productRoutes from "./routes/productRoutes.js";
import pool from "./config/db.js"; 
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------------
// CHECK POSTGRESQL CONNECTION
// ------------------------------------------------
pool.query("SELECT NOW()")
  .then(() => console.log("PostgreSQL Connected Successfully"))
  .catch(err => console.log("PostgreSQL Connection Error:", err.message));

// ------------------------------------------------
// RAZORPAY INSTANCE
// ------------------------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ------------------------------------------------
// PAYMENT ROUTES
// ------------------------------------------------
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, key: process.env.RAZORPAY_KEY_ID, order });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: "Cannot create order" });
  }
});

app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      return res.json({ success: true, message: "Payment Verified Successfully" });
    }

    res.status(400).json({ success: false, message: "Invalid Signature" });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Verification Failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);


app.get("/", (req, res) => res.json({ message: "Ecommerce API Running Successfully" }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
