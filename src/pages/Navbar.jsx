import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Target,
  LayoutDashboard,
  Trophy,
  LogOut,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">⚡ Logic Detective</div>

      <div className="nav-links">
        <NavLink to="/home"><Home size={18}/> Home</NavLink>
        <NavLink to="/learn"><BookOpen size={18}/> Learn</NavLink>
        <NavLink to="/missions"><Target size={18}/> Mission</NavLink>
        <NavLink to="/dashboard"><LayoutDashboard size={18}/> Dashboard</NavLink>
        <NavLink to="/leaderboard"><Trophy size={18}/> Leaderboard</NavLink>
      </div>

      <button className="logout-nav" onClick={handleLogout}>
        <LogOut size={18}/> Logout
      </button>
    </nav>
  );
}