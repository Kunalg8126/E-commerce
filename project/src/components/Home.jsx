import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import { ShoppingBag, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from backend
  const fetchSuggestions = async (text) => {
    setQuery(text);

    if (text.length < 1) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/products/suggestions?query=${text}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  return (
    <div className="home-container">
      
      {/* HERO SECTION */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            <Sparkles className="icon" /> Welcome to <span>E-Shop</span>
          </h1>

          <p className="hero-subtitle">
            Discover AI-recommended trending products for you.
          </p>

          {/* ⭐ SEARCH BAR WITH AUTOSUGGEST ⭐ */}
          <div className="search-wrapper">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => fetchSuggestions(e.target.value)}
              />
              <button
                className="search-btn"
                onClick={() => navigate(`/products?search=${query}`)}
              >
                <Search size={18} /> Search
              </button>
            </div>

            {/* AUTOCOMPLETE LIST */}
            {suggestions.length > 0 && (
              <div className="suggestion-box">
                {suggestions.map((s, index) => (
                  <p
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setQuery(s.name);
                      setSuggestions([]);
                      navigate(`/products?search=${s.name}`);
                    }}
                  >
                    🔍 {s.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* CTA BUTTONS */}
          <div className="cta-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag size={18} /> Shop Now
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/categories")}
            >
              Explore Categories
            </button>
          </div>
        </div>
      </motion.section>

      {/* CATEGORY SECTION (unchanged) */}
    </div>
  );
}

export default Home;
  