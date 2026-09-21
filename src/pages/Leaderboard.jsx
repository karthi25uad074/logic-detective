import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Zap, Target } from "lucide-react";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
  setLoading(true);

  // Students table
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("id, roll_no, email");

  if (studentError) {
    console.log(studentError);
    setLoading(false);
    return;
  }

  // Progress table
  const { data: progress, error: progressError } = await supabase
    .from("progress")
    .select("user_id, xp, completed_levels");

  if (progressError) {
    console.log(progressError);
    setLoading(false);
    return;
  }

  // Merge both tables
  const board = students
    .map((student) => {
      const p = progress.find((item) => item.user_id === student.id);

      return {
        roll_no: student.roll_no,
        email: student.email,
        xp: p?.xp || 0,
        completed_levels: p?.completed_levels || 0,
      };
    })
    .sort((a, b) => b.xp - a.xp);

  setLeaders(board);
  setLoading(false);
}

  function medal(rank) {
    if (rank === 1) return <Trophy color="#FFD700" size={26} />;
    if (rank === 2) return <Medal color="#C0C0C0" size={26} />;
    if (rank === 3) return <Award color="#CD7F32" size={26} />;
    return `#${rank}`;
  }

  return (
    <div className="leaderboard-page">

      <div className="leaderboard-grid"></div>

      <Navbar />

      <div className="leaderboard-container">

        <span className="leaderboard-badge">GLOBAL RANKING</span>

        <h1>🏆 Circuit Detective Leaderboard</h1>

        <p>Compete with your classmates and become Rank #1.</p>

        {loading ? (
          <div className="loading-card">
            Loading Leaderboard...
          </div>
        ) : (
          <div className="leaderboard-table">

            <div className="table-header">
              <span>Rank</span>
              <span>Roll No</span>
              <span>XP</span>
              <span>Missions</span>
            </div>

            {leaders.map((student, index) => (
              <div
                key={student.roll_no}
                className={`table-row ${index < 3 ? "top3" : ""}`}
              >

                <div className="rank">
                  {medal(index + 1)}
                </div>

                <div className="student">
                  <strong>{student.roll_no}</strong>
                  <small>{student.email}</small>
                </div>

                <div className="xp">
                  <Zap size={18} color="#00d4ff" />
                  {student.xp}
                </div>

                <div className="mission">
                  <Target size={18} color="#00d4ff" />
                  {student.completed_levels}/5
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}