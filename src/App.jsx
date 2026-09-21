import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Level4 from "./pages/Level4";
import Level5 from "./pages/Level5";
import Leaderboard from "./pages/Leaderboard";
import Learn from "./pages/Learn";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/missions/level1" element={<Level1 />} />
      <Route path="/missions/level2" element={<Level2 />} />
      <Route path="/missions/level3" element={<Level3 />} />
      <Route path="/missions/level4" element={<Level4/>}/>
      <Route path="/missions/level5" element={<Level5/>}/>
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/learn" element={<Learn/>}/>
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}