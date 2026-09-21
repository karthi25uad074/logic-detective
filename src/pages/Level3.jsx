import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Unlock,
  Search,
  Zap,
} from "lucide-react";
import Navbar from "./Navbar";
import "./Level3.css";

export default function Level3() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [fingerprint, setFingerprint] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [intro, setIntro] = useState(true);
  const [timer, setTimer] = useState(90);
  const [attempts, setAttempts] = useState(5);

  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = fingerprint ? 0 : 1;
  const observed = 0; // Hidden SA0

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (intro) return;

    if (timer <= 0) {
      setMessage("⏳ Vault permanently locked. Mission Failed.");
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
    osc.frequency.value = success ? 820 : 220;

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

    if (data.completed_missions?.includes("level3")) {
      setMessage("✅ Mission already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp: data.xp + 100,
        completed_levels: Math.max(data.completed_levels, 3),
        completed_missions: [...(data.completed_missions || []), "level3"],
      })
      .eq("user_id", user.id);

    return true;
  }

  async function handleSubmit() {
    if (timer <= 0) return;

    if (answer !== "SA0") {
      beep(false);
      setAttempts((p) => p - 1);

      if (attempts <= 1) {
        setMessage("💥 Security lockdown activated!");
      } else {
        setMessage(`❌ Wrong Diagnosis. Attempts Left: ${attempts - 1}`);
      }
      return;
    }

    const ok = await completeMission();
    if (!ok) return;

    beep(true);
    setXpAnim(true);
    setMessage("🔓 VAULT ACCESS RESTORED! +100 XP");

    setTimeout(() => navigate("/missions"), 3500);
  }

  return (
    <div className="level3-page">
      <div className="level3-grid"></div>

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
              <span>MISSION 03</span>

              <h1>SECURITY LOCK</h1>

              <p>🔒 Research Vault access has been denied.</p>
              <p>Fingerprint scanner is connected through a NOT Gate.</p>
              <p>Restore access before the security system locks forever.</p>

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
          <div className="hud-box danger">🔒 LOCKDOWN</div>
        </div>

        <div className="mission-head">
          <span className="mission-pill">RESEARCH VAULT CONTROL</span>

          <h1>Security Lock (NOT Gate)</h1>

          <p>NOT Gate always gives the opposite output.</p>
        </div>

        <div className="objective-panel">
          <h3>Mission Objectives</h3>

          <div className="objective-list">

            <div className="objective">
              <ShieldCheck size={18}/>
              Restore vault access.
            </div>

            <div className="objective">
              <Fingerprint size={18}/>
              Test fingerprint scanner.
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
              NOT Gate should invert the fingerprint signal.
              Something is preventing the vault from unlocking.
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
                  💡 If input is 0, NOT Gate outputs 1.
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

            <span>Fingerprint</span>

            <button
              className={fingerprint ? "switch on" : "switch off"}
              onClick={() => setFingerprint(fingerprint ? 0 : 1)}
            >
              {fingerprint ? (
                <Fingerprint size={28}/>
              ) : (
                <Fingerprint size={28}/>
              )}
            </button>

          </div>

          <div className={`wire ${fingerprint ? "active" : ""}`}></div>

          <div className="gate-wrapper">

            <motion.svg
              viewBox="0 0 140 140"
              className="not-gate"
              animate={{ rotate: [0, 0.5, -0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >

              <path
                d="M25 20 L25 120 L95 70 Z"
                fill="#08182f"
                stroke="#00d4ff"
                strokeWidth="4"
              />

              <circle
                cx="105"
                cy="70"
                r="8"
                fill="#08182f"
                stroke="#00d4ff"
                strokeWidth="4"
              />

              <text
                x="42"
                y="78"
                fill="#63cfff"
                fontSize="22"
                fontWeight="bold"
              >
                NOT
              </text>

            </motion.svg>

          </div>

          <div className={`wire ${observed ? "active" : "fault-wire"}`}></div>

          <div className="bulb-area">

            <motion.div
              className={`vault ${observed ? "vault-open" : "vault-closed"}`}
              animate={observed ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {observed ? <Unlock size={34}/> : <Lock size={34}/>}
            </motion.div>

            <span>Vault Lock</span>

          </div>

        </div>

        <motion.div
          className="quiz-card"
          whileHover={{ scale: 1.01 }}
        >

          <h2>Identify the Fault</h2>

          <p>
            Why does the vault remain locked even though the NOT Gate should unlock it?
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
            Diagnose Security Lock
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
                +100 XP ⚡
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </div>
  );
}