import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`http://localhost:5000/api/cart/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart(data.cart);
        }
      });


  }, []);

  const addToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first!");
      return;
    }


    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        productId: product.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setCart((prev) => [...prev, product]);
    }

  };

  const removeFromCart = async (id) => {
    const res = await fetch("[http://localhost:5000/api/cart/remove](http://localhost:5000/api/cart/remove)", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id }),
    });


    const data = await res.json();

    if (data.success) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }


  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};
