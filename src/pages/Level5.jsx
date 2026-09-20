import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "./Navbar";
import "./Level5.css";

export default function Level5(){

const navigate=useNavigate();

const [user,setUser]=useState(null);

const [timer,setTimer]=useState(90);
const [lives,setLives]=useState(3);

const [answer,setAnswer]=useState("");
const [message,setMessage]=useState("");

const [hintStep,setHintStep]=useState(0);
const [showCertificate,setShowCertificate]=useState(false);

useEffect(()=>{
supabase.auth.getUser().then(({data})=>setUser(data.user));
},[]);

useEffect(()=>{
if(timer<=0)return;

const i=setInterval(()=>{
setTimer(t=>t-1);
},1000);

return()=>clearInterval(i);

},[timer]);

const hints=[
"The fault isn't in the first gate.",
"Compare XOR expected vs observed.",
"XOR should output HIGH when inputs differ."
];

async function finishGame(){

const {data}=await supabase
.from("progress")
.select("*")
.eq("user_id",user.id)
.single();

if(data.completed_missions.includes("level5")){
setMessage("Already completed.");
return false;
}

await supabase
.from("progress")
.update({
xp:data.xp+500,
completed_levels:5,
completed_missions:[...data.completed_missions,"level5"]
})
.eq("user_id",user.id);

return true;
}

async function submit(){

if(answer!=="XOR"){

const remain=lives-1;

setLives(remain);

if(remain<=0){
setMessage("Mission Failed.");
}

return;
}

const ok=await finishGame();

if(!ok)return;

setMessage("🏆 Smart City Saved!");

setShowCertificate(true);

}

return(

<div className="boss-page">

<div className="boss-grid"></div>

<Navbar/>

<div className="boss-container">

<span className="boss-badge">FINAL BOSS</span>

<h1>The Blackout Protocol</h1>

<div className="hud">

<div>⏱ {timer}s</div>

<div>❤️ {"❤️".repeat(lives)}</div>

<div>⚡ Reward:500 XP</div>

</div>

<div className="logicbot">

🤖 {hints[hintStep]}

<button onClick={()=>setHintStep(Math.min(hintStep+1,2))}>
Next Hint
</button>

</div>

<div className="triple-circuit">

<div className="gate and">AND</div>

<div className="wire active"></div>

<div className="gate xor faultgate">XOR</div>

<div className="wire fault"></div>

<div className="gate nor">NOR</div>

</div>

<div className="diagnosis-grid">

<div className="diag">
<h3>Expected</h3>
<p>AND:0</p>
<p>XOR:1</p>
<p>NOR:0</p>
</div>

<div className="diag danger">
<h3>Observed</h3>
<p>AND:0</p>
<p>XOR:0</p>
<p>NOR:1</p>
</div>

</div>

<div className="scope">

<h2>Oscilloscope</h2>

<div className="wave"></div>

</div>

<div className="quiz">

<h2>Which Gate Failed?</h2>

<div className="choices">

{["AND","XOR","NOR"].map(g=>(

<button
key={g}
className={answer===g?"selected":""}
onClick={()=>setAnswer(g)}
>

{g}

</button>

))}

</div>

<button className="submit" onClick={submit}>
Save the City
</button>

{message&&<div className="result">{message}</div>}

</div>

{showCertificate&&(

<div className="certificate">

<h1>🏆 Certified Circuit Detective</h1>

<p>Mission Completed Successfully</p>

<p>Total XP:1000</p>

<button onClick={()=>navigate("/dashboard")}>
Go to Dashboard
</button>

</div>

)}

</div>

</div>

);

}