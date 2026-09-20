import { motion } from "framer-motion";
import { Play, BookOpen, LayoutDashboard, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-grid"></div>

      {/* Permanent Navbar */}
      <Navbar />

      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="badge">EC2201 Digital Systems Game</span>

        <h1>⚡ Logic Detective</h1>

        <p>
          Become a Circuit Detective. Learn Digital Logic Gates by solving
          real fault diagnosis missions using Stuck-at Fault simulation.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/missions")}
          >
            <Play size={20} />
            Start Mission
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/learn")}
          >
            <BookOpen size={20} />
            Learn Gates
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
        </div>
      </motion.section>

      <section className="feature-grid">
        <div className="feature-card">
          <Zap size={32} />
          <h3>Interactive Gates</h3>
          <p>Learn AND, OR, XOR, NAND, NOR and NOT gates through gameplay.</p>
        </div>

        <div className="feature-card">
          <Zap size={32} />
          <h3>Fault Detection</h3>
          <p>Inject SA0 and SA1 faults to investigate real circuit failures.</p>
        </div>

        <div className="feature-card">
          <Zap size={32} />
          <h3>Mission Based Learning</h3>
          <p>Earn XP, unlock levels and become the best Circuit Detective.</p>
        </div>
      </section>
    </div>
  );
}