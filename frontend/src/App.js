import React, { useEffect, useState } from "react";

const API_BASE = "https://punch-in-app-544x.onrender.com/api";

function App() {
  const [punches, setPunches] = useState([]);
  const [manualTime, setManualTime] = useState("");

  // Fetch all punches
  const fetchPunches = async () => {
    try {
      const res = await fetch(`${API_BASE}/punches`);
      const data = await res.json();
      setPunches(data);
    } catch (err) {
      console.error("Error fetching punches:", err);
    }
  };

  useEffect(() => {
    fetchPunches();
  }, []);

  // Auto punch in (local time)
  const handleAutoPunch = async () => {
    const time = new Date().toLocaleString();
    await savePunch(time);
  };

  // Manual punch in
  const handleManualPunch = async () => {
    if (!manualTime) return alert("Please enter a time");
    await savePunch(manualTime);
    setManualTime("");
  };

  // Save punch
  const savePunch = async (time) => {
    try {
      await fetch(`${API_BASE}/punches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time }),
      });
      fetchPunches();
    } catch (err) {
      console.error("Error saving punch:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial" }}>
      <h1>🕒 Punch In Tracker</h1>

      <div style={{ margin: "20px" }}>
        <button onClick={handleAutoPunch}>📍 Auto Punch In (Local Time)</button>
      </div>

      <div style={{ margin: "20px" }}>
        <input
          type="text"
          placeholder="Enter manual time"
          value={manualTime}
          onChange={(e) => setManualTime(e.target.value)}
        />
        <button onClick={handleManualPunch}>✍️ Manual Punch In</button>
      </div>

      <h2>All Punches</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {punches.map((p, i) => (
          <li key={i} style={{ marginBottom: "10px" }}>
            ⏰ {p.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
