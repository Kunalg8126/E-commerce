import express from "express";
import { 
  signup, 
  login, 
  getUserDetails,
  getAllUsers,
  deleteUser,
  sendOTP,
  verifyOTP
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.get("/dashboard", protect, getUserDetails);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user
  });
});

router.get("/all-users", getAllUsers);
router.delete("/delete-user", deleteUser);

export default router;
