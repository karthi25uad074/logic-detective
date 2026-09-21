import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Lightbulb,
  Moon,
  Sun,
  Trophy
} from "lucide-react";
import Navbar from "./Navbar";
import "./Level5.css";

export default function Level5() {

  const navigate = useNavigate();

  const [user,setUser]=useState(null);

  const [motionSensor,setMotionSensor]=useState(0);
  const [daylight,setDaylight]=useState(0);

  const [answer,setAnswer]=useState("");
  const [message,setMessage]=useState("");

  const [intro,setIntro]=useState(true);
  const [timer,setTimer]=useState(90);
  const [attempts,setAttempts]=useState(5);

  const [showHint,setShowHint]=useState(false);
  const [xpAnim,setXpAnim]=useState(false);

  const expected=!(motionSensor||daylight)?1:0;
  const observed=0;

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user));
  },[]);

  useEffect(()=>{
    if(intro)return;

    if(timer<=0){
      setMessage("⏳ Street lights failed.");
      return;
    }

    const t=setTimeout(()=>setTimer(v=>v-1),1000);
    return()=>clearTimeout(t);

  },[timer,intro]);

  function beep(success=true){

    const ctx=new AudioContext();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();

    osc.type=success?"triangle":"sawtooth";
    osc.frequency.value=success?900:240;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value=.08;

    osc.start();
    osc.stop(ctx.currentTime+.18);

  }

  async function completeMission(){

    if(!user)return false;

    const {data}=await supabase
      .from("progress")
      .select("*")
      .eq("user_id",user.id)
      .single();

    if(!data)return false;

    if(data.completed_missions?.includes("level5")){
      setMessage("🏆 Easy Mode already completed.");
      return false;
    }

    await supabase
      .from("progress")
      .update({
        xp:data.xp+150,
        completed_levels:Math.max(data.completed_levels,5),
        completed_missions:[...(data.completed_missions||[]),"level5"]
      })
      .eq("user_id",user.id);

    return true;
  }

  async function handleSubmit(){

    if(timer<=0)return;

    if(answer!=="SA0"){

      beep(false);
      setAttempts(p=>p-1);

      if(attempts<=1){
        setMessage("💥 City blackout.");
      }else{
        setMessage(`❌ Wrong Diagnosis. Attempts Left: ${attempts-1}`);
      }

      return;
    }

    const ok=await completeMission();
    if(!ok)return;

    beep(true);
    setXpAnim(true);

    setMessage("🏆 EASY MODE COMPLETED! +150 XP");

    setTimeout(()=>navigate("/missions"),4000);

  }

  return(
    <div className="level5-page">

      <div className="level5-grid"></div>

      <Navbar/>

      <AnimatePresence>

        {intro&&(

          <motion.div
            className="mission-intro"
            initial={{opacity:1}}
            exit={{opacity:0}}
          >

            <motion.div
              className="intro-card"
              initial={{scale:.8}}
              animate={{scale:1}}
            >

              <span>MISSION 05</span>

              <h1>SMART STREET LIGHT</h1>

              <p>🌃 Smart City lighting network failed.</p>

              <p>NOR Gate controls automatic street lights.</p>

              <p>Complete Easy Mode.</p>

              <button onClick={()=>setIntro(false)}>
                START FINAL EASY MISSION
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      <div className="level-container">

        <div className="hud-top">

          <div className="hud-box">⏱ {timer}s</div>

          <div className="hud-box">Attempts {attempts}/5</div>

          <div className="hud-box danger">CITY DARK</div>

        </div>

        <div className="mission-head">

          <span className="mission-pill">
            SMART CITY CONTROL
          </span>

          <h1>Smart Street Light</h1>

          <p>Street lights should turn ON only when both inputs are OFF.</p>

        </div>

        <div className="objective-panel">

          <h3>Mission Objectives</h3>

          <div className="objective-list">

            <div className="objective">
              <ShieldCheck size={18}/>
              Restore lighting.
            </div>

            <div className="objective">
              <Moon size={18}/>
              Test night logic.
            </div>

            <div className="objective">
              <Zap size={18}/>
              Find hidden fault.
            </div>

          </div>

        </div>

        <div className="logic-bot">

          <div className="bot-avatar">🤖</div>

          <div className="bot-box">

            <strong>Logic Bot</strong>

            <p>
              NOR outputs HIGH only when every input is LOW.
            </p>

            <button onClick={()=>setShowHint(!showHint)}>
              {showHint?"Hide Hint":"Need Hint?"}
            </button>

            <AnimatePresence>

              {showHint&&(

                <motion.div
                  className="hint"
                  initial={{opacity:0,y:-10}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0}}
                >
                  💡 Motion=0 and Daylight=0 should turn ON the street light.
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

            <span>Motion</span>

            <button
              className={motionSensor?"switch on":"switch off"}
              onClick={()=>setMotionSensor(motionSensor?0:1)}
            >
              {motionSensor}
            </button>

          </div>

          <div className={`wire ${motionSensor?"active":""}`}></div>

          <div className="gate-wrapper">

            <motion.svg
              viewBox="0 0 140 140"
              className="nor-gate"
              animate={{rotate:[0,.5,-.5,0]}}
              transition={{repeat:Infinity,duration:2}}
            >

              <path
                d="M18 20 Q45 70 18 120 Q75 130 118 70 Q75 10 18 20"
                fill="#08182f"
                stroke="#00d4ff"
                strokeWidth="4"
              />

              <circle
                cx="120"
                cy="70"
                r="6"
                fill="#08182f"
                stroke="#00d4ff"
                strokeWidth="3"
              />

              <text
                x="38"
                y="75"
                fill="#63cfff"
                fontSize="20"
                fontWeight="bold"
              >
                NOR
              </text>

            </motion.svg>

          </div>

          <div className={`wire ${observed?"active":"fault-wire"}`}></div>

          <div className="bulb-area">

            <motion.div
              className={`street-light ${observed?"light-on":"light-off"}`}
              animate={observed?{scale:[1,1.08,1]}:{}}
              transition={{repeat:Infinity,duration:.8}}
            >
              <Lightbulb size={34}/>
            </motion.div>

            <span>Street Light</span>

          </div>

          <div className={`wire ${daylight?"active":""}`}></div>

          <div className="switch-column">

            <span>Daylight</span>

            <button
              className={daylight?"switch on":"switch off"}
              onClick={()=>setDaylight(daylight?0:1)}
            >
              {daylight}
            </button>

          </div>

        </div>

        <motion.div
          className="quiz-card"
          whileHover={{scale:1.01}}
        >

          <h2>Identify the Fault</h2>

          <p>
            The street light never turns ON.
            Which hidden fault forces the output LOW?
          </p>

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

          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            Complete Easy Mode
          </button>

          <AnimatePresence>

            {message&&(

              <motion.div
                className="result"
                initial={{opacity:0}}
                animate={{opacity:1}}
              >
                {message}
              </motion.div>

            )}

          </AnimatePresence>

          <AnimatePresence>

            {xpAnim&&(

              <motion.div
                className="xp-popup"
                initial={{scale:.5,y:40}}
                animate={{scale:1.2,y:-70}}
                exit={{opacity:0}}
              >
                +150 XP ⚡
              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>

        <motion.div
          className="easy-complete"
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{delay:1}}
        >

          <Trophy size={48} color="#FFD700"/>

          <h2>Easy Mode Finale</h2>

          <p>Complete this mission to unlock Detective Mode (Levels 6–15).</p>

        </motion.div>

      </div>

    </div>
  );
}