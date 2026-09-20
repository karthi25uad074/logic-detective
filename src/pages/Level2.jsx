import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Level2.css";

export default function Level2() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = a | b;
  const observed = 1; // Hidden SA1

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  function beep(success = true) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = success ? "triangle" : "square";
    osc.frequency.value = success ? 900 : 220;

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

    if (!data.completed_missions?.includes("level1")) {
      setMessage("❌ Complete Level 1 first.");
      return false;
    }

    if (data.completed_missions?.includes("level2")) {
      setMessage("✅ Level 2 already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp: data.xp + 100,
        completed_levels: Math.max(data.completed_levels, 2),
        completed_missions: [...data.completed_missions, "level2"],
      })
      .eq("user_id", user.id);

    return true;
  }

  async function handleSubmit() {
    if (answer !== "SA1") {
      beep(false);
      setMessage("❌ Wrong Diagnosis.");
      return;
    }

    const awarded = await completeMission();

    if (!awarded) return;

    beep(true);
    setXpAnim(true);
    setMessage("🎉 Mission Cleared! +100 XP");

    setTimeout(() => navigate("/missions"), 2500);
  }

  return (
    <div className="level2-page">

      <div className="level2-grid"></div>

      <Navbar />

      <div className="level2-container">

        <span className="mission-pill">MISSION 02</span>

        <h1>Emergency Exit Circuit</h1>

        <p>Find why the alarm stays ON.</p>

        <div className="bot-box">

          <strong>🤖 Logic Bot</strong>

          <p>
            OR Gate should turn ON only when at least one switch is ON.
          </p>

          <button onClick={() => setShowHint(!showHint)}>
            {showHint ? "Hide Hint" : "Need Hint?"}
          </button>

          {showHint && (
            <div className="hint">
              When both inputs are 0, OR output should be 0.
            </div>
          )}

        </div>

        <div className="circuit">

          <div className="switch-col">
            <span>A</span>
            <button onClick={() => setA(a ? 0 : 1)}>{a}</button>
          </div>

          <div className={`wire ${a ? "active" : ""}`}></div>

          <svg className="or-gate" viewBox="0 0 150 140">
            <path
              d="M20 20 Q55 70 20 120 L70 120 Q135 70 70 20 Z"
              fill="#0b1835"
              stroke="#00b7ff"
              strokeWidth="4"
            />
            <text
              x="62"
              y="75"
              fill="#63cfff"
              fontSize="24"
              fontWeight="bold"
            >
              OR
            </text>
          </svg>

          <div className="wire fault-wire"></div>

          <div className="bulb-area">
            <div className="bulb bulb-on"></div>
            <span>Alarm</span>
          </div>

          <div className="switch-col">
            <span>B</span>
            <button onClick={() => setB(b ? 0 : 1)}>{b}</button>
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

          <h2>Which Fault Occurred?</h2>

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

          {xpAnim && <div className="xp-popup">+100 XP ⚡</div>}

        </div>

      </div>

    </div>
  );
}