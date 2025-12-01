import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Signup.css";
import { auth, setupRecaptcha } from "./Firebase";
import {RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "", mobile: "" });
  const [otp, setOtp] = useState("");


  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!userData.name || !userData.email || !userData.mobile) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = "+91" + userData.mobile;
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      window.confirmationResult = confirmation;

      setLoading(false);
      setStep(2);
      alert("OTP Sent Successfully!");
    } catch (error) {
      console.error("OTP send error:", error);
      setLoading(false);
      alert("OTP sending failed");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await window.confirmationResult.confirm(otp);
      setLoading(false);
      alert("OTP Verified Successfully!");

      setStep(1);
      setUserData({ name: "", email: "", mobile: "" });
      setOtp("");
    } catch (error) {
      console.error("OTP verify error:", error);
      setLoading(false);
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="signup-wrapper">

      {/* Recaptcha should ALWAYS stay outside the form to prevent DOM removal */}
      <div id="recaptcha-container" className="recaptcha-box"></div>

      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="title">{step === 1 ? "Create Account" : "Verify OTP"}</h2>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="form">

            <div className="input-box">
              <input type="text" name="name" value={userData.name} onChange={handleChange} required />
              <label>Full Name</label>
            </div>

            <div className="input-box">
              <input type="email" name="email" value={userData.email} onChange={handleChange} required />
              <label>Email Address</label>
            </div>

            <div className="input-box">
              <input type="text" name="mobile" value={userData.mobile} onChange={handleChange} required />
              <label>Mobile Number</label>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="otp-box">
            <input
              maxLength="6"
              className="otp-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOTP} className="btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Signup;
