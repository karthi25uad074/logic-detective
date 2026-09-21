import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import "./Learn.css";

const gateInfo = {
  AND: {
    desc: "Output is HIGH only when both inputs are HIGH.",
    truth: [
      [0,0,0],[0,1,0],[1,0,0],[1,1,1]
    ]
  },
  OR: {
    desc: "Output is HIGH when at least one input is HIGH.",
    truth: [
      [0,0,0],[0,1,1],[1,0,1],[1,1,1]
    ]
  },
  XOR: {
    desc: "Output is HIGH only when inputs are different.",
    truth: [
      [0,0,0],[0,1,1],[1,0,1],[1,1,0]
    ]
  },
  NAND: {
    desc: "Inverse of AND Gate.",
    truth: [
      [0,0,1],[0,1,1],[1,0,1],[1,1,0]
    ]
  },
  NOR: {
    desc: "Inverse of OR Gate.",
    truth: [
      [0,0,1],[0,1,0],[1,0,0],[1,1,0]
    ]
  },
  NOT: {
    desc: "Inverts the input.",
    truth: [
      [0,"-",1],[1,"-",0]
    ]
  }
};
function GateSVG({ gate }) {
  const stroke = "#00d4ff";
  const fill = "#0b1835";

  switch (gate) {
    case "AND":
      return (
        <svg viewBox="0 0 140 120" className="gate-svg">
          <path d="M20 20 L70 20 A40 40 0 0 1 70 100 L20 100 Z"
            fill={fill} stroke={stroke} strokeWidth="4"/>
        </svg>
      );

    case "OR":
      return (
        <svg viewBox="0 0 150 120" className="gate-svg">
          <path d="M20 20 Q60 60 20 100 L70 100 Q140 60 70 20 Z"
            fill={fill} stroke={stroke} strokeWidth="4"/>
        </svg>
      );

    case "XOR":
      return (
        <svg viewBox="0 0 160 120" className="gate-svg">
          <path d="M18 20 Q58 60 18 100"
            fill="none" stroke={stroke} strokeWidth="3"/>
          <path d="M32 20 Q72 60 32 100 L80 100 Q145 60 80 20 Z"
            fill={fill} stroke={stroke} strokeWidth="4"/>
        </svg>
      );

    case "NAND":
      return (
        <svg viewBox="0 0 160 120" className="gate-svg">
          <path d="M20 20 L70 20 A40 40 0 0 1 70 100 L20 100 Z"
            fill={fill} stroke={stroke} strokeWidth="4"/>
          <circle cx="118" cy="60" r="8"
            fill={fill} stroke={stroke} strokeWidth="4"/>
        </svg>
      );

    case "NOR":
      return (
        <svg viewBox="0 0 170 120" className="gate-svg">
          <path d="M20 20 Q60 60 20 100 L70 100 Q140 60 70 20 Z"
            fill={fill} stroke={stroke} strokeWidth="4"/>
          <circle cx="145" cy="60" r="8"
            fill={fill} stroke={stroke} strokeWidth="4"/>
        </svg>
      );

    case "NOT":
  return (
    <svg viewBox="0 0 180 120" className="gate-svg">
      {/* Triangle */}
      <path
        d="M35 20 L35 100 L110 60 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Inversion Bubble */}
      <circle
        cx="122"
        cy="60"
        r="8"
        fill={fill}
        stroke={stroke}
        strokeWidth="5"
      />
    </svg>
  );

    default:
      return null;
  }
}
export default function Learn() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const output = (() => {
    switch(gate){
      case "AND": return a & b;
      case "OR": return a | b;
      case "XOR": return a ^ b;
      case "NAND": return Number(!(a & b));
      case "NOR": return Number(!(a | b));
      case "NOT": return Number(!a);
      default: return 0;
    }
  })();

  return (
    <div className="learn-page">

      <div className="learn-grid"></div>

      <Navbar/>

      <div className="learn-container">

        <motion.div
          className="learn-header"
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
        >
          <span className="learn-badge">LOGIC LAB</span>
          <h1>Learn Digital Logic Gates</h1>
          <p>Experiment with switches and understand gate behaviour visually.</p>
        </motion.div>

        {/* Gate Selector */}
        <div className="gate-selector">
          {Object.keys(gateInfo).map(g=>(
            <button
              key={g}
              className={gate===g?"active-gate":""}
              onClick={()=>setGate(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="simulator">

  <div className="inputs">
    <div className="switch-box">
      <span>A</span>
      <button onClick={() => setA(a ? 0 : 1)}>{a}</button>
    </div>

    {gate !== "NOT" && (
      <div className="switch-box">
        <span>B</span>
        <button onClick={() => setB(b ? 0 : 1)}>{b}</button>
      </div>
    )}
  </div>

  <div className="circuit-area">

    <svg className="circuit-svg" viewBox="0 0 700 220">

      {/* Input wires */}
      <line x1="80" y1="70" x2="170" y2="70" className="wire-line"/>
      {gate !== "NOT" && (
        <line x1="80" y1="150" x2="170" y2="150" className="wire-line"/>
      )}

      {/* Gate */}
      <foreignObject x="170" y="30" width="220" height="160">
        <div className="gate-wrapper">
          <motion.div
            className="gate-shape"
            key={gate}
            initial={{ scale: .8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <GateSVG gate={gate}/>
          </motion.div>
        </div>
      </foreignObject>

      {/* Output wire */}
      <line
  x1={gate === "NOT" ? "350" : "390"}
  y1="110"
  x2="520"
  y2="110"
  className="wire-line"
/>

    </svg>

    <div className={`bulb ${output ? "on" : "off"}`}></div>

  </div>

  <div className="gate-label">{gate}</div>

</div>

        {/* Output */}
        <div className="output-card">
          <h2>Live Output</h2>
          <div className="output-number">{output}</div>
          <p>{gateInfo[gate].desc}</p>
        </div>

        {/* Truth Table */}
        <div className="truth-card">

          <h2>{gate} Truth Table</h2>

          <table>
            <thead>
              <tr>
                <th>A</th>
                {gate!=="NOT" && <th>B</th>}
                <th>Output</th>
              </tr>
            </thead>

            <tbody>
              {gateInfo[gate].truth.map((row,i)=>(
                <tr
                  key={i}
                  className={
                    row[0]===a &&
                    (gate==="NOT" || row[1]===b)
                    ? "highlight":""
                  }
                >
                  <td>{row[0]}</td>
                  {gate!=="NOT" && <td>{row[1]}</td>}
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Logic Bot */}
        <div className="logic-card">
          <div className="bot">🤖</div>
          <div>
            <h3>Logic Bot</h3>
            <p>
              {gate==="AND" && "Both inputs must be HIGH to produce HIGH output."}
              {gate==="OR" && "Any one HIGH input is enough."}
              {gate==="XOR" && "Different inputs produce HIGH."}
              {gate==="NAND" && "Think of AND, then invert it."}
              {gate==="NOR" && "Think of OR, then invert it."}
              {gate==="NOT" && "NOT simply flips the input."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}