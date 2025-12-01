import React from "react";
import ProductCard from "./ProductCard";
import "../styles/Product.css";

function Products() {
  const items = [
    { id: 1, name: "Classic T-Shirt", price: 499, image: "https://i.ibb.co/0JmVtJY/tshirt.jpg" },
    { id: 2, name: "Blue Denim Jeans", price: 999, image: "https://i.ibb.co/r6pXtwk/jeans.jpg" },
    { id: 3, name: "Running Shoes", price: 1499, image: "https://i.ibb.co/4W2N1Pw/shoes.jpg" },
    { id: 4, name: "Smart Watch", price: 1999, image: "https://i.ibb.co/Mszn0rM/watch.jpg" },
    { id: 5, name: "Wireless Earbuds", price: 1299, image: "https://i.ibb.co/Jv4jF4d/earbuds.jpg" },
    { id: 6, name: "Backpack", price: 899, image: "https://i.ibb.co/FV24L8p/backpack.jpg" },
  ];

  return (
    <div className="products-container">
      <h2 className="products-title">Trending Products</h2>

      <div className="product-grid">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default Products;
