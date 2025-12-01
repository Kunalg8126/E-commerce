import React, { useState } from "react";
import "../styles/Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/contact/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.success) {
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  } else {
    alert("Something went wrong: " + data.message);
  }
};


  return (
    <div className="contact-container">

      {/* HEADER SECTION */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions? We're here to help you 24×7.</p>
      </div>

      {/* MAIN GRID */}
      <div className="contact-grid">

        {/* LEFT SIDE INFO */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Our team is always available to assist you. Whether it's product
            inquiries, order tracking, or support — we respond quickly.
          </p>

          <div className="info-box">
            <h3>📍 Address</h3>
            <p>Delta 1 c Block Greater Noida</p>
          </div>

          <div className="info-box">
            <h3>📞 Phone</h3>
            <p>+91 7599603540</p>
          </div>

          <div className="info-box">
            <h3>📧 Email</h3>
            <p>Mukundmadhav123@gmail.com</p>
          </div>

          <div className="info-box">
            <h3>⏳ Working Hours</h3>
            <p>Mon – Fri: 10:00 AM – 7:00 PM</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Send Message</button>
        </form>

      </div>
    </div>
  );
}
