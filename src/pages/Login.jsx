import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid email or password.");
      return;
    }

    onLogin(data.user);
  };

  return (
    <div className="login-page">
      <div className="login-grid"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-logo">
  <ShieldCheck size={60} color="#00b7ff" />
</div>

      <h1 className="login-title">
  Logic
  <br/>
  Detective
</h1>

<p className="login-subtitle">Student Login</p>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <Mail size={20} />
            <input
              type="email"
              placeholder="College Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <span className="error">{error}</span>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
<p className="login-note">
  Use your college email and password:
  <br/>
  <span className="password-highlight">student@123</span>
</p>
      </motion.div>
    </div>
  );
}