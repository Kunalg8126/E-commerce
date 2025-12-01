import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Products from "./components/Product";
import Cart from "./components/Cart";
import About from "./components/About";
import Contact from "./components/Contact";
import OrderSummary from "./components/Order";
import Payment from "./components/Paymentpage";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";

import { CartProvider, useCart } from "./contexts/CartContext";


function Layout() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/login";


  const { cart } = useCart();
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/signup" element={<Signup />} />
        {/* ✅ Pass totalAmount to Checkout */}
        <Route path="/checkout" element={<Checkout cartTotal={totalAmount} />} />
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>

  );
}


function App() {
  return (<CartProvider> <Router> <Layout /> </Router> </CartProvider>
  );
}

export default App;
