import { useState } from "react";

function ReportForm({ setResult }) {
  const [report, setReport] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!report || !location) {
      alert("Please enter report and location");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report,
          location,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.log(error);
      alert("Server connection failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report Disaster</h2>

      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <textarea
        placeholder="Describe the disaster"
        value={report}
        onChange={(e) => setReport(e.target.value)}
      />

      <button type="submit">Send Report</button>
    </form>
  );
}

export default ReportForm;