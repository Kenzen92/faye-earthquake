import { useState } from "react";
import "../App.css";

export default function State() {
  const [currentText, setCurrentText] = useState<string>("loading");
  const [num, setNum] = useState<number>(0);
  const [input, setInput] = useState<number>(0);

  return (
    <div className="app-container">
      <h1>State</h1>
      <p className="subtitle">Example of React state</p>
      <div className="card-grid">
        <div className="card">
          <h2>Text</h2>
          <p>{currentText}</p>
          <button onClick={() => setCurrentText("Hello, world!")}>
            Set Text
          </button>
        </div>
        <div className="card">
          <h2>Number</h2>
          <p>{num}</p>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
          <button onClick={() => setNum(input)}>Submit</button>
        </div>
      </div>
    </div>
  );
}
