import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  BatteryWarning,
  ShieldCheck,
  Lightbulb,
  Zap,
} from "lucide-react";
import Navbar from "./Navbar";
import "./Level1.css";

export default function Level1() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [intro, setIntro] = useState(true);

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [timer, setTimer] = useState(90);
  const [attempts, setAttempts] = useState(5);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = a & b;
  const observed = 0; // Hidden SA0 fault

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (intro) return;
    if (timer <= 0) return;

    const t = setInterval(() => {
      setTimer((v) => v - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [intro, timer]);

  function beep(success = true) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = success ? "triangle" : "sawtooth";
    osc.frequency.value = success ? 700 : 250;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0.08;

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  async function completeMission() {
    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!data) {
      await supabase.from("progress").insert({
        user_id: user.id,
        xp: 50,
        completed_levels: 1,
        completed_missions: ["level1"],
      });
      return true;
    }

    if (data.completed_missions?.includes("level1")) {
      setMessage("Mission already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp: data.xp + 50,
        completed_levels: Math.max(data.completed_levels, 1),
        completed_missions: [...(data.completed_missions || []), "level1"],
      })
      .eq("user_id", user.id);

    return true;
  }

  async function handleSubmit() {
    if (timer <= 0 || attempts <= 0) return;

    if (answer !== "SA0") {
      beep(false);
      setAttempts((p) => p - 1);
      setMessage(`Wrong diagnosis! Attempts left: ${attempts - 1}`);
      return;
    }

    const ok = await completeMission();
    if (!ok) return;

    beep(true);
    setXpAnim(true);
    setMessage("Power Restored! +50 XP");

    setTimeout(() => navigate("/missions"), 3000);
  }

  return (
    <div className="level-page">

      <div className="level-grid"></div>

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
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
            >
              <BatteryWarning size={60} color="#00d4ff" />

              <span>MISSION 01</span>

              <h1>POWER RESTORE</h1>

              <p>
                Campus Power Control Room has gone OFFLINE.
              </p>

              <p>
                Restore electricity before emergency backup fails.
              </p>

              <button onClick={() => setIntro(false)}>
                START INVESTIGATION ⚡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="level-container">

        <div className="hud-top">

          <div className="hud-box">
            <Timer size={18} />
            {timer}s
          </div>

          <div className="hud-box">
            Attempts {attempts}/5
          </div>

          <div className="hud-box danger">
            SYSTEM OFFLINE
          </div>

        </div>

        <div className="mission-head">
<div className="objectives-card">
  <h2>🎯 Mission Objectives</h2>

  <div className="objectives-list">

    <div className="objective-item">
      <div className="objective-icon">⚡</div>
      <div className="objective-text">
        <h4>Restore Power</h4>
        <p>Bring the control room back online.</p>
      </div>
      <span className="objective-status">Pending</span>
    </div>

    <div className="objective-item">
      <div className="objective-icon">🔍</div>
      <div className="objective-text">
        <h4>Inspect the Circuit</h4>
        <p>Compare Expected vs Observed Output.</p>
      </div>
      <span className="objective-status">Pending</span>
    </div>

    <div className="objective-item">
      <div className="objective-icon">🧠</div>
      <div className="objective-text">
        <h4>Identify the Fault</h4>
        <p>Find the hidden SA0 fault.</p>
      </div>
      <span className="objective-status">Pending</span>
    </div>

  </div>
</div>
          <span className="mission-pill">
            CAMPUS POWER CONTROL ROOM
          </span>

          <h1>AND Gate Rescue</h1>

          <p>
            Restore electricity before the emergency backup shuts down.
          </p>

        </div>

        <div className="objective-panel">

          <h3>Mission Objectives</h3>

          <div className="objective-list">

            <div className="objective">
              <ShieldCheck size={18} />
              Restore power.
            </div>

            <div className="objective">
              <Zap size={18} />
              Find hidden fault.
            </div>

            <div className="objective">
              <Lightbulb size={18} />
              Diagnose correctly.
            </div>

          </div>

        </div>

        <div className="logic-bot">

          <div className="bot-avatar">🤖</div>

          <div className="bot-box">

            <strong>Logic Bot</strong>

            <p>
              Voltage isn't reaching the bulb. Compare Expected Output with
              Observed Output.
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
                  Hint: AND gate produces HIGH only when both inputs are HIGH.
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        <div className="voltage-panel">

          <div>
            Voltage
            <h2>{observed ? "5V" : "0V"}</h2>
          </div>

          <div>
            Circuit Status
            <h2>{observed ? "ONLINE" : "OFFLINE"}</h2>
          </div>

        </div>

        <div className="circuit-panel">

          <div className="switch-column">
            <span>A</span>

            <button
              className={a ? "switch on" : "switch off"}
              onClick={() => setA(a ? 0 : 1)}
            >
              {a}
            </button>
          </div>

          <div className={`wire ${a ? "active" : ""}`}></div>

          <div className="gate-wrapper">

            <motion.svg
              className="and-gate"
              viewBox="0 0 140 140"
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <path
                d="M20 20 L70 20 A50 50 0 0 1 70 120 L20 120 Z"
                fill="#071c3d"
                stroke="#00d4ff"
                strokeWidth="4"
              />

              <text
                x="45"
                y="75"
                fill="#7fdfff"
                fontSize="22"
                fontWeight="bold"
              >
                AND
              </text>
            </motion.svg>

          </div>

          <div className="wire fault-wire"></div>

          <div className="bulb-area">

            <motion.div
              className={`bulb ${observed ? "bulb-on" : "bulb-off"}`}
              animate={
                observed
                  ? { scale: [1, 1.08, 1] }
                  : { opacity: [0.8, 1, 0.8] }
              }
              transition={{ repeat: Infinity, duration: 1 }}
            />

            <span>Power Output</span>

          </div>

          <div className="switch-column">
            <span>B</span>

            <button
              className={b ? "switch on" : "switch off"}
              onClick={() => setB(b ? 0 : 1)}
            >
              {b}
            </button>
          </div>

        </div>

        <div className="status-grid">

          <motion.div className="status-card" whileHover={{ y: -5 }}>
            <span>Expected Output</span>
            <h2>{expected}</h2>
          </motion.div>

          <motion.div className="status-card danger" whileHover={{ y: -5 }}>
            <span>Observed Output</span>
            <h2>{observed}</h2>
          </motion.div>

        </div>

        <motion.div className="quiz-card" whileHover={{ scale: 1.01 }}>

          <h2>Identify the Fault</h2>

          <p>
            Which hidden fault keeps the output permanently LOW?
          </p>

          <div className="choices">

            {["None", "SA0", "SA1"].map((opt) => (
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
            Diagnose Circuit
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
                initial={{ scale: 0.4, y: 40 }}
                animate={{ scale: 1.2, y: -60 }}
                exit={{ opacity: 0 }}
              >
                +50 XP ⚡
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>

    </div>
  );
}