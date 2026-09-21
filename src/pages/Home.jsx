import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  LayoutDashboard,
  Zap,
  Trophy,
  Users,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Animated Background */}
      <div className="home-grid"></div>
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <Navbar />

      <motion.section
        className="hero-card"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="badge">🎮 EC2201 Digital Systems Game</span>

        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          ⚡ Logic Detective
        </motion.h1>

        <p>
          Become a <strong>Circuit Detective</strong>. Investigate AND, OR,
          XOR, NAND and NOR gate failures using real <b>Stuck-at Fault</b>
          diagnosis through story-based missions.
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

        {/* Live Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <Cpu size={30} />
            <h2>5</h2>
            <span>Game Missions</span>
          </div>

          <div className="stat-card">
            <Zap size={30} />
            <h2>1000</h2>
            <span>Total XP</span>
          </div>

          <div className="stat-card">
            <Users size={30} />
            <h2>130</h2>
            <span>Students</span>
          </div>

          <div className="stat-card">
            <Trophy size={30} />
            <h2>#1</h2>
            <span>Leaderboard Goal</span>
          </div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <section className="feature-grid">
        <motion.div
          whileHover={{ y: -10 }}
          className="feature-card"
        >
          <Cpu size={38} color="#00d4ff" />
          <h3>Interactive Gates</h3>
          <p>Control switches, observe outputs and understand logic visually.</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="feature-card"
        >
          <Zap size={38} color="#00ff88" />
          <h3>Fault Diagnosis</h3>
          <p>Detect SA0 and SA1 faults like a real circuit engineer.</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -10 }}
          className="feature-card"
        >
          <Trophy size={38} color="#FFD700" />
          <h3>Mission Progress</h3>
          <p>Earn XP, unlock new levels and climb the leaderboard.</p>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <motion.section
        className="cta-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <h2>Ready to Save the Circuit?</h2>
        <p>Every mission teaches a real EC2201 concept through gameplay.</p>

        <button
          className="cta-btn"
          onClick={() => navigate("/missions")}
        >
          Begin Investigation ⚡
        </button>
      </motion.section>
    </div>
  );
}