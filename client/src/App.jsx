import { useState } from "react";
import ReportForm from "./components/ReportForm";
import Dashboard from "./components/Dashboard";
import "./index.css";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app">
      <h1>ResQAI</h1>
      <p>Disaster Response Multi-Agent System</p>

      <ReportForm setResult={setResult} />

      <Dashboard result={result} />
    </div>
  );
}

export default App;