import React from "react";
import { useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const { orderDetails } = location.state || {};

  if (!orderDetails) return <p>No order found.</p>;

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p><b>Order ID:</b> {orderDetails.order_id}</p>
      <p><b>Payment ID:</b> {orderDetails.payment_id}</p>
      <p><b>Amount Paid:</b> ₹{orderDetails.amount / 100}</p>
    </div>
  );
}

export default OrderSuccess;
