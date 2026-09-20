import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Missions.css";

export default function Missions() {
  const navigate = useNavigate();
  const [completedLevels, setCompletedLevels] = useState(0);

  useEffect(() => {
    async function loadProgress() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) return;

      const { data } = await supabase
        .from("progress")
        .select("completed_levels")
        .eq("user_id", authData.user.id)
        .single();

      if (data) {
        setCompletedLevels(data.completed_levels);
      }
    }

    loadProgress();
  }, []);

  const levels = [
    {
      id: 1,
      title: "AND Gate Rescue",
      xp: 50,
      unlocked: true,
      description: "Find the hidden SA0 fault."
    },
    {
      id: 2,
      title: "OR Gate Challenge",
      xp: 100,
      unlocked: completedLevels >= 1,
      description: "Unlock after Level 1."
    },
    {
      id: 3,
      title: "XOR Mystery",
      xp: 150,
      unlocked: completedLevels >= 2,
      description: "Unlock after Level 2."
    },
    {
      id: 4,
      title: "NAND & NOR Lab",
      xp: 200,
      unlocked: completedLevels >= 3,
      description: "Unlock after Level 3."
    },
    {
      id: 5,
      title: "Final Boss",
      xp: 500,
      unlocked: completedLevels >= 4,
      description: "Ultimate detective mission."
    }
  ];

  return (
    <div className="missions-page">
      <div className="missions-grid-bg"></div>

      <Navbar />

      <motion.div
        className="mission-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="mission-badge">MISSION CONTROL</span>

        <h1>Circuit Detective HQ</h1>

        <p>Complete missions to unlock new challenges.</p>
      </motion.div>

      <div className="mission-grid">
        {levels.map((level) => (
          <motion.div
            key={level.id}
            className={`mission-card ${!level.unlocked ? "locked" : ""}`}
            whileHover={level.unlocked ? { scale: 1.03 } : {}}
          >
            <div className="level-top">
              <span>Level {level.id}</span>

              {level.unlocked ? (
                <CheckCircle size={20} color="#00ff88" />
              ) : (
                <Lock size={20} color="#9ca3af" />
              )}
            </div>

            <h2>{level.title}</h2>

            <p>{level.description}</p>

            <div className="xp-tag">⚡ {level.xp} XP</div>

            {level.unlocked ? (
              <button
                className="play-btn"
                onClick={() => {
  if (level.id === 1) navigate("/missions/level1");
  if (level.id === 2) navigate("/missions/level2");
  if (level.id === 3) navigate("/missions/level3");
  if(level.id===4) navigate("/missions/level4");
  if(level.id===5) navigate("/missions/level5");
}}
              >
                <Play size={18} />
                Play Mission
              </button>
            ) : (
              <button className="locked-btn" disabled>
                Locked
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}