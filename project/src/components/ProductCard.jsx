import React from "react";
import "../styles/ProductCard.css";
import { ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  
  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Item added to cart!");
    } else {
      alert("Failed to add item to cart");
    }
  };

  return (
    <div className="card">
      <img src={product.image} alt={product.name} className="card-img" />

      <h3 className="card-name">{product.name}</h3>
      <p className="card-price">₹{product.price}</p>

      <button className="card-btn" onClick={handleAddToCart}>
        <ShoppingCart size={18} /> Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
