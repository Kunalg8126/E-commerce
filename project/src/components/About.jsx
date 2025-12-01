import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Our Store</h1>
        <p>
          We are a next-generation e-commerce brand committed to delivering
          high-quality products with a seamless shopping experience. Our mission
          is to make online shopping simple, fast, and trustworthy for everyone.
        </p>
      </section>

      <section className="about-values">
        <h2>Why Customers Trust Us</h2>
        <div className="values-grid">

          <div className="value-card">
            <h3>Premium Quality</h3>
            <p>
              Every product is hand-checked by our quality team so customers
              receive only the best.
            </p>
          </div>

          <div className="value-card">
            <h3>Fast Delivery</h3>
            <p>
              With a strong logistics network, we ensure your orders reach you
              as quickly as possible.
            </p>
          </div>

          <div className="value-card">
            <h3>24×7 Support</h3>
            <p>
              Our customer support team is always available to assist you with
              queries and concerns.
            </p>
          </div>

        </div>
      </section>

      <section className="about-story">
        <h2>Our Journey</h2>
        <p>
          Started as a small online shop, today we serve thousands of customers
          across India. Our growth is powered by customer trust and our
          dedication to building a brand that focuses on transparency, quality,
          and honest pricing.
        </p>
        <p>
          We constantly innovate by using advanced technology, AI-based product
          recommendations, real-time inventory tracking, and secure payments to
          give users a world-class shopping experience.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <p>
          Our team is a blend of designers, developers, operations experts, and
          customer care professionals—working together to build a platform that
          people love to shop on.
        </p>
      </section>
    </div>
  );
}
