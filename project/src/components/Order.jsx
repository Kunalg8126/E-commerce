import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSummary() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Summary</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #aaa",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h4>{item.name}</h4>
          <p>Price: ₹{item.price}</p>
        </div>
      ))}

      <h3>Total Amount: ₹{total}</h3>

      <button
        onClick={() => navigate("/payment")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Proceed to Pay
      </button>
    </div>
  );
}

export default OrderSummary;
