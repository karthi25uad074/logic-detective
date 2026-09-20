import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Level1.css";

export default function Level1() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = a & b;
  const observed = 0; // Hidden SA0

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

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
    osc.stop(ctx.currentTime + 0.2);
  }

  async function completeMission() {
  const { data } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // First time player
  if (!data) {
    await supabase.from("progress").insert({
      user_id: user.id,
      xp: 50,
      completed_levels: 1,
      completed_missions: ["level1"],
    });

    return true;
  }

  // Already completed Level 1
  if (data.completed_missions?.includes("level1")) {
    setMessage("✅ Level 1 already completed. No additional XP awarded.");
    return false;
  }

  // First completion
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
  if (answer !== "SA0") {
    beep(false);
    setMessage("❌ Wrong Diagnosis. Observe Expected vs Observed.");
    return;
  }

  const awarded = await completeMission();

  if (!awarded) return;

  beep(true);
  setXpAnim(true);
  setMessage("🎉 Mission Cleared! +50 XP");

  setTimeout(() => navigate("/missions"), 2500);
}

  return (
    <div className="level-page">

      <div className="level-grid"></div>

      <Navbar />

      <div className="level-container">

        <div className="mission-head">
          <span className="mission-pill">MISSION 01</span>
          <h1>AND Gate Rescue</h1>
          <p>Repair the failed circuit before the factory shuts down.</p>
        </div>

        <div className="logic-bot">

          <div className="bot-avatar">🤖</div>

          <div className="bot-box">
            <strong>Logic Bot</strong>

            <p>
              Compare Expected Output with Observed Output.
              Something is forcing the output LOW.
            </p>

            <button onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Need Hint?"}
            </button>

            {showHint && (
              <div className="hint">
                💡 If A=1 and B=1, an AND gate should output 1.
              </div>
            )}
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

            <svg viewBox="0 0 140 140" className="and-gate">

              <path
                d="M20 20 L70 20 A50 50 0 0 1 70 120 L20 120 Z"
                fill="#0b1835"
                stroke="#00b7ff"
                strokeWidth="4"
              />

              <text
                x="45"
                y="75"
                fill="#63cfff"
                fontSize="22"
                fontWeight="bold"
              >
                AND
              </text>

            </svg>

          </div>

          <div className={`wire ${observed ? "active" : "fault-wire"}`}></div>

          <div className="bulb-area">

            <div className={`bulb ${observed ? "bulb-on" : "bulb-off"}`}></div>

            <span>Output</span>

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

          <div className="status-card">
            <span>Expected</span>
            <h2>{expected}</h2>
          </div>

          <div className="status-card danger">
            <span>Observed</span>
            <h2>{observed}</h2>
          </div>

        </div>

        <div className="quiz-card">

          <h2>Identify the Fault</h2>

          <p>
            Why is the output staying LOW even though the inputs suggest otherwise?
          </p>

          <div className="choices">

            {["None","SA0","SA1"].map(opt => (
              <button
                key={opt}
                className={answer===opt ? "selected":""}
                onClick={()=>setAnswer(opt)}
              >
                {opt}
              </button>
            ))}

          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Diagnose Circuit
          </button>

          {message && <div className="result">{message}</div>}

          {xpAnim && <div className="xp-popup">+50 XP ⚡</div>}

        </div>

      </div>

    </div>
  );
}