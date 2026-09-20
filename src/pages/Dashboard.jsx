import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Dashboard.css";
import { Trophy, Zap, Target } from "lucide-react";

export default function Dashboard({ user }) {

  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState({
    xp: 0,
    completed_levels: 0,
    accuracy: 0,
  });
  const [rank, setRank] = useState("-");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(student);

    const { data: prog } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (prog) {
      setProgress(prog);
    }

    const { data: board } = await supabase
      .from("progress")
      .select("user_id,xp")
      .order("xp", { ascending: false });

    if (board) {
      const position =
        board.findIndex((item) => item.user_id === user.id) + 1;

      setRank(position > 0 ? position : "-");
    }
  }

  return (
    <div className="dashboard">

      <div className="dashboard-grid"></div>

      <Navbar />

      <section className="welcome-card">

        <h2>Welcome, Detective!</h2>

        <p>
          <strong>Roll No:</strong> {profile?.roll_no || "Loading..."}
        </p>

        <p>
          <strong>Email:</strong> {profile?.email || user.email}
        </p>

      </section>

      <section className="stats">

        <div className="stat-box">
          <Zap size={32} color="#00d4ff" />
          <h3>{progress.xp}</h3>
          <span>Total XP</span>
        </div>

        <div className="stat-box">
          <Target size={32} color="#00d4ff" />
          <h3>{progress.completed_levels}/5</h3>
          <span>Completed Missions</span>
        </div>

        <div className="stat-box">
          <Trophy size={32} color="#FFD700" />
          <h3>{rank}</h3>
          <span>Leaderboard Rank</span>
        </div>

      </section>

      <section className="progress-card">

        <h2>XP Progress</h2>

        <div className="xp-bar">

          <div
            className="xp-fill"
            style={{
              width: `${Math.min((progress.xp / 500) * 100, 100)}%`,
            }}
          ></div>

        </div>

        <p>{progress.xp} / 500 XP</p>

      </section>

    </div>
  );
}