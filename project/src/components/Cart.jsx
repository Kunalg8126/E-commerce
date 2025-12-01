import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // -------------------------------
  // 1. Fetch Cart Items from Backend
  // -------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    fetch(`http://localhost:5000/api/cart/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart(data.cart);

          // Save cart to localStorage for Summary Page
          localStorage.setItem("cart", JSON.stringify(data.cart));
        }
      })
      .catch((err) => console.log("Cart fetch error:", err));
  }, []);

  // -------------------------------
  // 2. Remove Cart Item
  // -------------------------------
  const removeItem = async (itemId) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (data.success) {
        setCart((prev) => {
          const updated = prev.filter((item) => item.id !== itemId);
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.log("Remove error:", error);
    }
  };

  // -------------------------------
  // 3. Navigate to Order Summary
  // -------------------------------
  const goToOrderSummary = () => {
    navigate("/order-summary");
  };

  // -------------------------------
  // 4. UI Section
  // -------------------------------
  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>

              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          {/* ⭐ NEW BUTTON */}
          <button
            onClick={goToOrderSummary}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
