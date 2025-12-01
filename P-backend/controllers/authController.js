import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

// ------------------------------------
// SIGNUP
// ------------------------------------
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    return res.json({
      message: "Signup Successful",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------------
// LOGIN
// ------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found. Please signup first." });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Missing JWT_SECRET in .env file" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login Successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------------
// GET USER DETAILS
// ------------------------------------
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user;

    const userData = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (userData.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(userData.rows[0]);
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------------
// GET ALL USERS
// ------------------------------------
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, password FROM users"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------------
// DELETE USER
// ------------------------------------
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    await pool.query("DELETE FROM users WHERE email = $1", [email]);

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Error deleting user" });
  }
};

// ------------------------------------
// SEND OTP (MSG91)
// ------------------------------------
export const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
    }

    if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_TEMPLATE_ID) {
      return res.status(500).json({
        success: false,
        message: "MSG91 credentials missing in .env",
      });
    }

    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile: `91${mobile}`,
        template_id: process.env.MSG91_TEMPLATE_ID,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    console.log("MSG91 OTP Sent:", response.data);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log("MSG91 OTP Error:", error.response?.data || error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Failed to send OTP",
    });
  }
};

// ------------------------------------
// VERIFY OTP (MSG91)
// ------------------------------------
export const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile & OTP required" });
    }

    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp/verify",
      {
        mobile: `91${mobile}`,
        otp: otp,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    console.log("MSG91 Verify:", response.data);

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response?.data?.message || "Invalid OTP",
    });
  }
};
