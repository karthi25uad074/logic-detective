import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Level4.css";

export default function Level4(){

const navigate=useNavigate();

const [user,setUser]=useState(null);
const [a,setA]=useState(1);
const [b,setB]=useState(1);

const [answer,setAnswer]=useState("");
const [timer,setTimer]=useState(60);
const [lives,setLives]=useState(3);
const [message,setMessage]=useState("");

const nandExpected=Number(!(a&b));
const norExpected=Number(!(nandExpected|0));

const nandObserved=0;
const finalObserved=0;

useEffect(()=>{
supabase.auth.getUser().then(({data})=>setUser(data.user));
},[]);

useEffect(()=>{
if(timer<=0)return;
const i=setInterval(()=>setTimer(t=>t-1),1000);
return()=>clearInterval(i);
},[timer]);

async function completeMission(){

const {data}=await supabase
.from("progress")
.select("*")
.eq("user_id",user.id)
.single();

if(data.completed_missions.includes("level4")){
setMessage("Already completed.");
return false;
}

await supabase
.from("progress")
.update({
xp:data.xp+200,
completed_levels:4,
completed_missions:[...data.completed_missions,"level4"]
})
.eq("user_id",user.id);

return true;
}

async function submit(){

if(answer!=="NAND"){

setLives(lives-1);

if(lives-1<=0){
setMessage("Mission Failed.");
}

return;
}

const ok=await completeMission();

if(!ok)return;

setMessage("Mission Cleared! +200 XP");

setTimeout(()=>{
navigate("/missions");
},2500);

}

return(
<div className="level4-page">

<div className="level4-grid"></div>

<Navbar/>

<div className="level4-container">

<span className="mission-pill">MISSION 04</span>

<h1>Power Grid Recovery</h1>

<div className="hud">
<div>⏱ {timer}s</div>
<div>❤️ {"❤️".repeat(lives)}</div>
</div>

<div className="logicbot">
🤖 The fault may not be in the final gate...
</div>

<div className="circuit">

<div className="switch-col">
<span>A</span>
<button onClick={()=>setA(a?0:1)}>{a}</button>
</div>

<div className="wire active"></div>

<div className="gate nand">NAND</div>

<div className="wire fault"></div>

<div className="gate nor">NOR</div>

<div className="wire fault"></div>

<div className="bulb off"></div>

<div className="switch-col">
<span>B</span>
<button onClick={()=>setB(b?0:1)}>{b}</button>
</div>

</div>

<div className="status-grid">

<div className="status-card">
<h3>NAND Expected</h3>
<h1>{nandExpected}</h1>
</div>

<div className="status-card">
<h3>NOR Expected</h3>
<h1>{norExpected}</h1>
</div>

<div className="status-card danger">
<h3>Observed</h3>
<h1>{finalObserved}</h1>
</div>

</div>

<div className="scope-card">

<h2>Oscilloscope</h2>

<div className="wave">
  <svg viewBox="0 0 600 120" width="100%" height="120">
    <path
      d="M0 60 L60 60 L60 20 L120 20 L120 60 L180 60 L180 20 L240 20 L240 60 L300 60 L300 20 L360 20 L360 60 L420 60 L420 20 L480 20 L480 60 L600 60"
      fill="none"
      stroke="#00b7ff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>

</div>

<div className="quiz-card">

<h2>Which Gate Failed?</h2>

<div className="choices">

{["NAND","NOR"].map(g=>(
<button
key={g}
className={answer===g?"selected":""}
onClick={()=>setAnswer(g)}
>
{g}
</button>
))}

</div>

<button className="submit-btn" onClick={submit}>
Repair Circuit
</button>

{message&&<div className="result">{message}</div>}

</div>

</div>

</div>
);

}