import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Siren, Search } from "lucide-react";
import Navbar from "./Navbar";
import "./Level2.css";

export default function Level2() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [door, setDoor] = useState(0);
  const [windowSensor, setWindowSensor] = useState(0);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [intro, setIntro] = useState(true);
  const [timer, setTimer] = useState(90);
  const [attempts, setAttempts] = useState(5);

  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = door | windowSensor;
  const observed = 1; // Hidden SA1

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (intro) return;
    if (timer <= 0) {
      setMessage("⏳ Intruder Escaped! Mission Failed.");
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
    osc.frequency.value = success ? 780 : 220;

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

    if (data.completed_missions?.includes("level2")) {
      setMessage("✅ Mission already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp: data.xp + 75,
        completed_levels: Math.max(data.completed_levels, 2),
        completed_missions: [...(data.completed_missions || []), "level2"],
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
        setMessage("💥 Security System Locked!");
      } else {
        setMessage(`❌ Wrong Diagnosis. Attempts Left: ${attempts - 1}`);
      }
      return;
    }

    const ok = await completeMission();
    if (!ok) return;

    beep(true);
    setXpAnim(true);
    setMessage("🚨 ALARM RESTORED! +75 XP");

    setTimeout(() => navigate("/missions"), 3500);
  }

  return (
    <div className="level2-page">
      <div className="level2-grid"></div>

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
              <span>MISSION 02</span>

              <h1>EMERGENCY ALARM</h1>

              <p>🚨 Intruder detected inside the campus.</p>
              <p>Door and Window sensors are connected through an OR Gate.</p>
              <p>Restore the alarm before the intruder escapes.</p>

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
          <div className="hud-box danger">🚨 ALARM OFFLINE</div>
        </div>

        <div className="mission-head">
          <span className="mission-pill">CAMPUS SECURITY CONTROL ROOM</span>
          <h1>Emergency Alarm (OR Gate)</h1>
          <p>Any one sensor should activate the alarm.</p>
        </div>

        <div className="objective-panel">
          <h3>Mission Objectives</h3>

          <div className="objective-list">

            <div className="objective">
              <ShieldCheck size={18}/>
              Restore security alarm.
            </div>

            <div className="objective">
              <Search size={18}/>
              Test both sensors.
            </div>

            <div className="objective">
              <Zap size={18}/>
              Find hidden fault.
            </div>

          </div>
        </div>

        <div className="logic-bot">
          <div className="bot-avatar">🤖</div>

          <div className="bot-box">
            <strong>Logic Bot</strong>

            <p>
              If either Door or Window detects movement,
              the alarm should activate.
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
                  💡 OR Gate outputs HIGH when any one input is HIGH.
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
            <span>Door</span>

            <button
              className={door ? "switch on" : "switch off"}
              onClick={() => setDoor(door ? 0 : 1)}
            >
              {door}
            </button>
          </div>

          <div className={`wire ${door ? "active" : ""}`}></div>

          <div className="gate-wrapper">

            <motion.svg
              viewBox="0 0 140 140"
              className="or-gate"
              animate={{ rotate: [0, 0.5, -0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <path
                d="M18 20 Q45 70 18 120 Q75 130 118 70 Q75 10 18 20"
                fill="#08182f"
                stroke="#00d4ff"
                strokeWidth="4"
              />

              <text
                x="48"
                y="75"
                fill="#63cfff"
                fontSize="22"
                fontWeight="bold"
              >
                OR
              </text>
            </motion.svg>

          </div>

          <div className={`wire ${observed ? "active" : "fault-wire"}`}></div>

          <div className="bulb-area">

            <motion.div
              className={`alarm ${observed ? "alarm-on" : "alarm-off"}`}
              animate={observed ? { scale: [1, 1.08, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.7 }}
            >
              <Siren size={34}/>
            </motion.div>

            <span>Emergency Alarm</span>

          </div>

          <div className={`wire ${windowSensor ? "active" : ""}`}></div>

          <div className="switch-column">
            <span>Window</span>

            <button
              className={windowSensor ? "switch on" : "switch off"}
              onClick={() => setWindowSensor(windowSensor ? 0 : 1)}
            >
              {windowSensor}
            </button>
          </div>

        </div>

        <motion.div
          className="quiz-card"
          whileHover={{ scale: 1.01 }}
        >
          <h2>Identify the Fault</h2>

          <p>
            Why does the alarm remain ON even when both sensors are OFF?
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
            Diagnose Alarm System
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
                +75 XP ⚡
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </div>
  );
}