import React, { useState, useEffect } from "react";

function App() {
  const [time, setTime] = useState("");
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = "https://https://punch-in-app-544x.onrender.com/api/punchin";

  // Get local time automatically when page loads
  useEffect(() => {
    const now = new Date();
    const local = now.toLocaleTimeString();
    setTime(local);
    fetchPunches();
  }, []);

  // Fetch all punch-ins
  const fetchPunches = async () => {
    try {
      const res = await fetch(backendUrl);
      const data = await res.json();
      setPunches(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Submit new punch-in
  const handlePunch = async () => {
    if (!time) return alert("Please enter a time");
    setLoading(true);
    try {
      await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time }),
      });
      alert("Punch-in saved!");
      setTime(new Date().toLocaleTimeString());
      fetchPunches();
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving punch-in");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>👋 Punch In Tracker</h2>
      <label>
        Enter Time (or keep auto):{" "}
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>
      <button
        onClick={handlePunch}
        disabled={loading}
        style={{
          marginLeft: "10px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Punch In"}
      </button>

      <h3 style={{ marginTop: "40px" }}>My Punch History</h3>
      {punches.length === 0 && <p>No punch-ins yet.</p>}
      <ul>
        {punches.map((p, i) => (
          <li key={i}>
            🕒 {p.time} — <small>{new Date(p.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
