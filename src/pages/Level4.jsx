import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Search,
  Cog,
  Play,
  Square,
} from "lucide-react";
import Navbar from "./Navbar";
import "./Level4.css";

export default function Level4() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [sensorA, setSensorA] = useState(0);
  const [sensorB, setSensorB] = useState(0);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [intro, setIntro] = useState(true);
  const [timer, setTimer] = useState(90);
  const [attempts, setAttempts] = useState(5);

  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = !(sensorA & sensorB) ? 1 : 0;
  const observed = 1; // Hidden SA1

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (intro) return;

    if (timer <= 0) {
      setMessage("⏳ Factory overheated. Mission Failed.");
      return;
    }

    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, intro]);

  function beep(success = true) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = success ? "triangle" : "sawtooth";
    osc.frequency.value = success ? 760 : 240;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0.08;

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  async function completeMission() {
    if (!user) return false;

    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!data) return false;

    if (data.completed_missions?.includes("level4")) {
      setMessage("✅ Mission already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp: data.xp + 125,
        completed_levels: Math.max(data.completed_levels, 4),
        completed_missions: [...(data.completed_missions || []), "level4"],
      })
      .eq("user_id", user.id);

    return true;
  }

  async function handleSubmit() {
    if (timer <= 0) return;

    if (answer !== "SA1") {
      beep(false);
      setAttempts((p) => p - 1);

      if (attempts <= 1) {
        setMessage("💥 Machine exploded!");
      } else {
        setMessage(`❌ Wrong Diagnosis. Attempts Left: ${attempts - 1}`);
      }
      return;
    }

    const ok = await completeMission();
    if (!ok) return;

    beep(true);
    setXpAnim(true);
    setMessage("🏭 MACHINE STABILIZED! +125 XP");

    setTimeout(() => navigate("/missions"), 3500);
  }

  return (
    <div className="level4-page">
      <div className="level4-grid"></div>

      <Navbar />

      <AnimatePresence>
        {intro && (
          <motion.div
            className="mission-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="intro-card"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <span>MISSION 04</span>

              <h1>FACTORY MACHINE</h1>

              <p>🏭 Production line is malfunctioning.</p>
              <p>NAND Gate controls the emergency stop system.</p>
              <p>Prevent the machine from overheating.</p>

              <button onClick={() => setIntro(false)}>
                START MISSION ⚡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="level-container">

        <div className="hud-top">
          <div className="hud-box">⏱ {timer}s</div>
          <div className="hud-box">Attempts {attempts}/5</div>
          <div className="hud-box danger">🔥 OVERHEAT WARNING</div>
        </div>

        <div className="mission-head">
          <span className="mission-pill">INDUSTRIAL CONTROL ROOM</span>

          <h1>Factory Machine (NAND Gate)</h1>

          <p>The machine should stop only under one condition.</p>
        </div>

        <div className="objective-panel">
          <h3>Mission Objectives</h3>

          <div className="objective-list">

            <div className="objective">
              <ShieldCheck size={18}/>
              Prevent overheating.
            </div>

            <div className="objective">
              <Cog size={18}/>
              Test both sensors.
            </div>

            <div className="objective">
              <Search size={18}/>
              Find hidden fault.
            </div>

          </div>
        </div>

        <div className="logic-bot">

          <div className="bot-avatar">🤖</div>

          <div className="bot-box">

            <strong>Logic Bot</strong>

            <p>
              A NAND gate outputs LOW only when both inputs are HIGH.
            </p>

            <button onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Need Hint?"}
            </button>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  className="hint"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  💡 Check what happens when both sensors become HIGH.
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        <div className="status-grid">

          <div className="status-card">
            <span>Expected</span>
            <h2>{expected}</h2>
          </div>

          <div className="status-card danger">
            <span>Observed</span>
            <h2>{observed}</h2>
          </div>

        </div>

        <div className="circuit-panel">

          <div className="switch-column">
            <span>Sensor A</span>

            <button
              className={sensorA ? "switch on" : "switch off"}
              onClick={() => setSensorA(sensorA ? 0 : 1)}
            >
              {sensorA}
            </button>
          </div>

          <div className={`wire ${sensorA ? "active" : ""}`}></div>

          <div className="gate-wrapper">

            <motion.svg
              viewBox="0 0 160 140"
              className="nand-gate"
              animate={{ rotate: [0, 0.4, -0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <path
                d="M20 20 L80 20 A50 50 0 0 1 80 120 L20 120 Z"
                fill="#08182f"
                stroke="#ffb347"
                strokeWidth="4"
              />

              <circle
                cx="132"
                cy="70"
                r="8"
                fill="#08182f"
                stroke="#ffb347"
                strokeWidth="4"
              />

              <text
                x="44"
                y="75"
                fill="#ffd37a"
                fontSize="22"
                fontWeight="bold"
              >
                NAND
              </text>

            </motion.svg>

          </div>

          <div className={`wire ${observed ? "active" : "fault-wire"}`}></div>

          <div className="bulb-area">

            <motion.div
              className={`machine ${observed ? "machine-on" : "machine-off"}`}
              animate={observed ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {observed ? <Play size={34}/> : <Square size={34}/>}
            </motion.div>

            <span>Factory Machine</span>

          </div>

          <div className={`wire ${sensorB ? "active" : ""}`}></div>

          <div className="switch-column">
            <span>Sensor B</span>

            <button
              className={sensorB ? "switch on" : "switch off"}
              onClick={() => setSensorB(sensorB ? 0 : 1)}
            >
              {sensorB}
            </button>
          </div>

        </div>

        <motion.div
          className="quiz-card"
          whileHover={{ scale: 1.01 }}
        >

          <h2>Identify the Fault</h2>

          <p>
            Why does the machine keep running even when both sensors should stop it?
          </p>

          <div className="choices">

            {["None","SA0","SA1"].map((opt) => (
              <button
                key={opt}
                className={answer === opt ? "selected" : ""}
                onClick={() => setAnswer(opt)}
              >
                {opt}
              </button>
            ))}

          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Diagnose Machine
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                className="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {xpAnim && (
              <motion.div
                className="xp-popup"
                initial={{ scale: 0.5, y: 40 }}
                animate={{ scale: 1.2, y: -70 }}
                exit={{ opacity: 0 }}
              >
                +125 XP ⚡
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </div>
  );
}