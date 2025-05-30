import React from "react";
import { motion } from "framer-motion";
import {useNavigate} from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="brand-title">waylo</h1>
      </header>

      <main className="landing-main">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="main-title"
        >
          Organize Your Adventures With Ease
        </motion.h2>
        <p className="main-description">
          Plan trips, manage expenses, and chat — all in one place.
        </p>
        <button className="btn main-btn" onClick={() => navigate("/auth")}>Get started</button>
      </main>

      <section className="features-section">
        {[
          {
            title: "Create or Join Trips",
            description: "Easily start a new adventure or join one already in motion.",
          },
          {
            title: "Group Chat",
            description: "Communicate with your travel companions in real-time.",
          },
          {
            title: "Expense Tracking",
            description: "Split costs fairly and keep track of everyone's contributions.",
          },
        ].map((feature, index) => (
          <div key={index} className="feature-card">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
