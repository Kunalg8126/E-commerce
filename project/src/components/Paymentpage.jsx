import React from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const handlePay = () => {
    setTimeout(() => {
      navigate("/order-success");
    }, 1000);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Page</h2>
      <p>Enter card details (UI dummy)...</p>

      <button
        onClick={handlePay}
        style={{
          background: "purple",
          padding: "12px 20px",
          color: "white",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

export default Payment;
