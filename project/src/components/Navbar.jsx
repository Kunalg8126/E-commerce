// src/components/Navbar.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import "../styles/Navbar.css";

export default function Navbar({ user, onLogout, cartCount = 0 }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAccount = () => {
    if (user && user.name) navigate("/"); 
    else navigate("/login");
    setOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="ai-navbar">
      <div className="nav-inner">

        {/* Logo */}
        <motion.div
          className="nav-brand"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => handleNavClick("/")}
        >
          <span className="brand-icon">🤖</span>
          <span className="brand-text">E-Shop <small>AI</small></span>
        </motion.div>

        {/* Desktop Links */}
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <motion.a whileHover={{ y: -3 }} onClick={() => handleNavClick("/")} className="nav-link">Home</motion.a>
          <motion.a whileHover={{ y: -3 }} onClick={() => handleNavClick("/products")} className="nav-link">Products</motion.a>
          <motion.a whileHover={{ y: -3 }} onClick={() => handleNavClick("/about")} className="nav-link">About</motion.a>
          <motion.a whileHover={{ y: -3 }} onClick={() => handleNavClick("/contact")} className="nav-link">Contact</motion.a>
        </nav>

        {/* Right Buttons */}
        <div className="nav-actions">

          {/* Cart */}
          <button className="cart-btn" onClick={() => handleNavClick("/cart")}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Login / Account */}
          <button className="account-btn" onClick={handleAccount}>
            <User size={18} />
            <span className="account-text">
              {user && user.name ? user.name.split(" ")[0] : "Login"}
            </span>
          </button>

          {/* Logout */}
          {user && (
            <button
              className="logout-btn"
              onClick={() => {
                onLogout?.();
                setOpen(false);
              }}
            >
              Logout
            </button>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="mobile-overlay"
        initial={{ height: 0 }}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
      >
        <div className="mobile-links">
          <button onClick={() => handleNavClick("/")} className="mobile-link">Home</button>
          <button onClick={() => handleNavClick("/products")} className="mobile-link">Products</button>
          <button onClick={() => handleNavClick("/about")} className="mobile-link">About</button>
          <button onClick={() => handleNavClick("/contact")} className="mobile-link">Contact</button>

          <hr />

          {/* Login or Account */}
          <button onClick={handleAccount} className="mobile-link">
            {user?.name ? `Account (${user.name.split(" ")[0]})` : "Login / Signup"}
          </button>

          {/* Logout in mobile */}
          {user && (
            <button
              onClick={() => {
                onLogout?.();
                setOpen(false);
              }}
              className="mobile-link logout"
            >
              Logout
            </button>
          )}
        </div>
      </motion.div>
    </header>
  );
}
