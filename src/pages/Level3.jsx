import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Level3.css";

export default function Level3() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [timer, setTimer] = useState(45);
  const [lives, setLives] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);

  const expected = a ^ b;
  const observed = 1; // Hidden SA1

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setMessage("⏰ Mission Failed! Time Over.");
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  function beep(success = true) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = success ? "triangle" : "square";
    osc.frequency.value = success ? 850 : 250;

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

    if (!data.completed_missions?.includes("level2")) {
      setMessage("❌ Complete Level 2 first.");
      return false;
    }

    if (data.completed_missions?.includes("level3")) {
      setMessage("✅ Level 3 already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp: data.xp + 150,
        completed_levels: Math.max(data.completed_levels, 3),
        completed_missions: [...data.completed_missions, "level3"],
      })
      .eq("user_id", user.id);

    return true;
  }

  async function handleSubmit() {
    if (answer !== "SA1") {
      beep(false);

      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setMessage("💀 Mission Failed! No Lives Left.");
      } else {
        setMessage(`❌ Wrong! ${newLives} lives remaining.`);
      }

      return;
    }

    const awarded = await completeMission();

    if (!awarded) return;

    beep(true);
    setXpAnim(true);
    setMessage("🎉 XOR Mystery Solved! +150 XP");

    setTimeout(() => navigate("/missions"), 2500);
  }

  return (
    <div className="level3-page">
      <div className="level3-grid"></div>

      <Navbar />

      <div className="level3-container">

        <span className="mission-pill">MISSION 03</span>

        <h1>XOR Mystery</h1>

        <p>Repair the smart security door.</p>

        <div className="hud">

          <div className="hud-card">⏱ {timer}s</div>

          <div className="hud-card">❤️ {"❤️".repeat(lives)}</div>

        </div>

        <div className="logic-bot">

          <div className="bot-avatar">🤖</div>

          <div className="bot-box">

            <strong>Logic Bot</strong>

            <p>XOR becomes HIGH only when inputs are different.</p>

            <button onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Need Hint?"}
            </button>

            {showHint && (
              <div className="hint">
                When A=1 and B=1, XOR should output 0.
              </div>
            )}

          </div>

        </div>

        <div className="circuit">

          <div className="switch-col">
            <span>A</span>
            <button onClick={() => setA(a ? 0 : 1)}>{a}</button>
          </div>

          <div className={`wire ${a ? "active" : ""}`}></div>

          <svg className="xor-gate" viewBox="0 0 160 140">

            <path
              d="M25 20 Q60 70 25 120"
              fill="none"
              stroke="#00b7ff"
              strokeWidth="3"
            />

            <path
              d="M40 20 Q75 70 40 120 L90 120 Q145 70 90 20 Z"
              fill="#0b1835"
              stroke="#00b7ff"
              strokeWidth="4"
            />

            <text
              x="72"
              y="76"
              fill="#63cfff"
              fontSize="22"
              fontWeight="bold"
            >
              XOR
            </text>

          </svg>

          <div className="wire fault-wire"></div>

          <div className="bulb-area">
            <div className="bulb bulb-on"></div>
            <span>Door Lock</span>
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

        <div className="truth-table-card">

          <h2>Live XOR Truth Table</h2>

          <table>
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
                <th>Output</th>
              </tr>
            </thead>

            <tbody>

              <tr className={a===0&&b===0?"highlight":""}>
                <td>0</td><td>0</td><td>0</td>
              </tr>

              <tr className={a===0&&b===1?"highlight":""}>
                <td>0</td><td>1</td><td>1</td>
              </tr>

              <tr className={a===1&&b===0?"highlight":""}>
                <td>1</td><td>0</td><td>1</td>
              </tr>

              <tr className={a===1&&b===1?"highlight":""}>
                <td>1</td><td>1</td><td>0</td>
              </tr>

            </tbody>
          </table>

        </div>

        <div className="quiz-card">

          <h2>Which Fault Occurred?</h2>

          <div className="choices">

            {["None","SA0","SA1"].map(opt=>(
              <button
                key={opt}
                className={answer===opt?"selected":""}
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

          {xpAnim && <div className="xp-popup">+150 XP ⚡</div>}

        </div>

      </div>

    </div>
  );
}